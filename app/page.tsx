"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMicVAD, utils } from "@ricky0123/vad-react";
import { Button, cn, ScrollShadow, Tooltip } from "@nextui-org/react";
import { LangObj, LanguageOptions } from "@/types/lang";
import { TranslationResponse } from "@/types/common";
import ShineBorder from "@/components/magicui/shine-border";
import LanguageSelection from "./subsirl/LanguageSelection";
import { BorderBeam } from "@/components/magicui/border-beam";
import Ripple from "@/components/magicui/ripple";
import DotPattern from "@/components/magicui/dot-pattern";
import { toast } from "sonner";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import Image from "next/image";
import { BottomFooter } from "@/components/BottomFooter";

export default function RealtimeTranslation() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  const [translatedSubtitles, setTranslatedSubtitles] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [languageSelected, setLanguageSelected] = useState<LangObj>({
    fromLanguage: LanguageOptions[0],
    toLanguage: LanguageOptions[3],
  });
  const [loading, setLoading] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const subtitlesRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const translationQueue = useRef<
    Array<{ id: number; promise: Promise<TranslationResponse> }>
  >([]);
  const nextId = useRef(0);

  const isLoggedIn = isLoaded && userId;

  useEffect(() => {
    if (isLoggedIn) {
      if (isCameraOn) {
        startCamera(isFrontCamera);
      } else {
        stopCamera();
      }
    } else {
      setModelMenuOpen(true);
      stopCamera();
    }
  }, [isCameraOn, isFrontCamera, isLoggedIn]);

  useEffect(() => {
    if (subtitlesRef.current) {
      subtitlesRef.current.scrollTop = subtitlesRef.current.scrollHeight;
    }
  }, [translatedSubtitles]);

  const startCamera = async (isFrontCamera: boolean) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: isFrontCamera ? "user" : "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast.message("To use Video Feed, Give Camera Permission.", {
          duration: 2000,
        });
        setIsCameraOn(false);
      }
    } else {
      console.error("getUserMedia is not supported in this browser");
      toast.message("To use Video Feed, Give Camera Permission.", {
        duration: 2000,
      });
      setIsCameraOn(false);
    }
  };
  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = async (isFrontCamera: boolean) => {
    const newIsFrontCamera = !isFrontCamera;
    setIsFrontCamera(newIsFrontCamera);
    stopCamera();
    await startCamera(newIsFrontCamera);
  };

  useMicVAD({
    startOnLoad: true,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: (audio) => {
      setIsSpeaking(false);
      const wav = utils.encodeWAV(audio);
      const blob = new Blob([wav], { type: "audio/wav" });
      enqueueTranscription(blob, languageSelected, !!isLoggedIn);
    },
    workletURL: "/vad.worklet.bundle.min.js",
    modelURL: "/silero_vad.onnx",
    ortConfig(ort: {
      env: {
        wasm: {
          wasmPaths: {
            "ort-wasm-simd-threaded.wasm": string;
            "ort-wasm-simd.wasm": string;
            "ort-wasm.wasm": string;
            "ort-wasm-threaded.wasm": string;
          };
          numThreads: number;
        };
      };
    }) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );

      ort.env.wasm = {
        wasmPaths: {
          "ort-wasm-simd-threaded.wasm": "/ort-wasm-simd-threaded.wasm",
          "ort-wasm-simd.wasm": "/ort-wasm-simd.wasm",
          "ort-wasm.wasm": "/ort-wasm.wasm",
          "ort-wasm-threaded.wasm": "/ort-wasm-threaded.wasm",
        },
        numThreads: isSafari ? 1 : 4,
      };
    },
  });

  const getTranscribe = async (
    audioBlob: Blob,
    languageSelected: LangObj
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    formData.append("config", JSON.stringify(languageSelected));

    try {
      setLoading(true);

      const response = await fetch("/api/subsirl", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription request failed");
      }

      const result: TranslationResponse = await response.json();
      if (result.translation.trim()) {
        setTranslatedSubtitles((prev) => `${prev} ${result.translation}`);
      }
    } catch (error) {
      console.error("Error in transcription:", error);
    } finally {
      setLoading(false);
    }
  };

  const processQueue = async () => {
    if (translationQueue.current.length === 0) return;

    const { id, promise } = translationQueue.current[0];
    try {
      const result = await promise;
      if (result.translation.trim()) {
        setTranslatedSubtitles((prev) => `${prev} ${result.translation}`);
      }
    } catch (error) {
      console.error("Error in transcription:", error);
    } finally {
      translationQueue.current.shift();
      processQueue();
    }
  };

  const enqueueTranscription = async (
    audioBlob: Blob,
    languageSelected: LangObj,
    isLoggedIn: boolean
  ) => {
    if (!isLoggedIn) {
      toast.message("Please login to use SubsIRL");
      return;
    }

    const id = nextId.current++;
    const promise = getTranscribe(audioBlob, languageSelected);
    translationQueue.current.push({ id, promise });

    processQueue();
  };

  return (
    <ShineBorder
      borderRadius={16}
      className={cn(
        "relative h-[calc(100dvh)]  w-full overflow-hidden flex flex-col  dark bg-background text-foreground   items-center justify-center "
      )}
      color={["#18181B", "#A1A1AA", "#F4F4F5"]}
      borderWidth={isSpeaking ? 5 : 0}
    >
      {isCameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute m-auto h-[98vh] w-[98vw] rounded-2xl  object-cover z-0"
        />
      ) : (
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />
      )}
      <div className="relative z-20 h-full w-full flex flex-col items-center justify-center">
        <div className="text-gray-300 text-sm mb-4 flex justify-center items-center flex-col gap-3 text-shadow ">
          {isSpeaking && <Ripple mainCircleOpacity={0.2} />}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="50"
            height="50"
            fill="none"
          >
            <path
              d="M17 7V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M17 7H14M17 11H14"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M20 11C20 15.4183 16.4183 19 12 19M12 19C7.58172 19 4 15.4183 4 11M12 19V22M12 22H15M12 22H9"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          {isSpeaking ? "Listening" : "Waiting for speech..."}
          <div className="flex gap-2">
            <Tooltip showArrow content="Turn Camera on/off">
              <Button
                isIconOnly
                size="lg"
                variant="flat"
                onClick={toggleCamera}
              >
                {isCameraOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                  >
                    <path
                      d="M11 8L13 8"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                  >
                    <path
                      d="M2.00189 1.99988L21.9772 21.9999"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M16.8516 16.8677C16.7224 17.8061 16.4665 18.4668 15.9595 18.9744C14.9356 19.9996 13.2877 19.9996 9.992 19.9996H8.99323C5.69749 19.9996 4.04961 19.9996 3.02575 18.9744C2.00189 17.9493 2.00189 16.2994 2.00189 12.9996V10.9996C2.00189 7.69971 2.00189 6.04979 3.02575 5.02466C3.36827 4.68172 3.78062 4.45351 4.30114 4.30164"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M8.23627 4.0004C8.47815 3.99988 8.72995 3.99988 8.99217 3.99988H9.99093C13.2867 3.99988 14.9346 3.99988 15.9584 5.02501C16.9822 6.05013 16.9822 7.70005 16.9822 10.9999V12.7573M16.9822 9.2313L19.3018 7.52901C20.7729 6.54061 21.4489 7.17184 21.6674 7.64835C22.1191 8.92801 21.9768 11.3935 21.9768 14.5416C21.8703 16.5549 21.5952 16.7718 21.3137 16.9938L21.3107 16.9961"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </Button>
            </Tooltip>
            {isCameraOn && (
              <Tooltip showArrow content="Switch Camera">
                <Button
                  isIconOnly
                  size="lg"
                  variant="flat"
                  onClick={() => switchCamera(isFrontCamera)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                  >
                    <path
                      d="M17 6C19.3456 6 20.0184 6 20.8263 6.61994C21.0343 6.77954 21.2205 6.96572 21.3801 7.17372C22 7.98164 22 9.15442 22 11.5V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16V11.5C2 9.15442 2 7.98164 2.61994 7.17372C2.77954 6.96572 2.96572 6.77954 3.17372 6.61994C3.98164 6 4.65442 6 7 6"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M17 7L16.1142 4.78543C15.732 3.82996 15.3994 2.7461 14.4166 2.25955C13.8924 2 13.2616 2 12 2C10.7384 2 10.1076 2 9.58335 2.25955C8.6006 2.7461 8.26801 3.82996 7.88583 4.78543L7 7"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.4868 10L14.9861 12.0844L14.1566 11.5661C13.5657 11.1173 12.8313 10.8512 12.0354 10.8512C10.0828 10.8512 8.5 12.4515 8.5 14.4256C8.5 16.3997 10.0828 18 12.0354 18C13.7457 18 15.1724 16.772 15.5 15.1405"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.9998 6H12.0088"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
        <div className=" w-full absolute bottom-0 left-0">
          <ScrollShadow
            ref={subtitlesRef}
            hideScrollBar
            className="h-full max-h-[25vh]  overflow-auto scrollbar-none w-full text-white p-2 px-3 sub_tb text-shadow  sm:p-8 sub_tb "
          >
            {loading && <BorderBeam colorFrom="#18181B" colorTo="#F4F4F5" />}
            <p
              className={cn(" text-lg pb-5  sm:text-2xl leading-8 roboto-slab")}
            >
              {translatedSubtitles
                ?.replaceAll('"', "")
                .replaceAll(" .", ".")
                .replaceAll(" ,", ".")
                .replaceAll(" ?", "?")}{" "}
            </p>
          </ScrollShadow>
        </div>
        <div className="absolute top-0 flex justify-between items-center gap-3 w-full">
          <Button isIconOnly size="lg" variant="light">
            <Image
              src="/android-chrome-192x192.png"
              width={"50"}
              height={"50"}
              className=" object-cover rounded-full "
              alt="SubsIRL - Subtitles in real life Logo"
            />
          </Button>
          <LanguageSelection
            languageSelected={languageSelected}
            setLanguageSelected={setLanguageSelected}
          />
          <Button
            isIconOnly
            size="lg"
            variant="faded"
            onClick={() => setModelMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
            >
              <path
                d="M2 18C2 16.4596 2 15.6893 2.34673 15.1235C2.54074 14.8069 2.80693 14.5407 3.12353 14.3467C3.68934 14 4.45956 14 6 14C7.54044 14 8.31066 14 8.87647 14.3467C9.19307 14.5407 9.45926 14.8069 9.65327 15.1235C10 15.6893 10 16.4596 10 18C10 19.5404 10 20.3107 9.65327 20.8765C9.45926 21.1931 9.19307 21.4593 8.87647 21.6533C8.31066 22 7.54044 22 6 22C4.45956 22 3.68934 22 3.12353 21.6533C2.80693 21.4593 2.54074 21.1931 2.34673 20.8765C2 20.3107 2 19.5404 2 18Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M14 18C14 16.4596 14 15.6893 14.3467 15.1235C14.5407 14.8069 14.8069 14.5407 15.1235 14.3467C15.6893 14 16.4596 14 18 14C19.5404 14 20.3107 14 20.8765 14.3467C21.1931 14.5407 21.4593 14.8069 21.6533 15.1235C22 15.6893 22 16.4596 22 18C22 19.5404 22 20.3107 21.6533 20.8765C21.4593 21.1931 21.1931 21.4593 20.8765 21.6533C20.3107 22 19.5404 22 18 22C16.4596 22 15.6893 22 15.1235 21.6533C14.8069 21.4593 14.5407 21.1931 14.3467 20.8765C14 20.3107 14 19.5404 14 18Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M2 6C2 4.45956 2 3.68934 2.34673 3.12353C2.54074 2.80693 2.80693 2.54074 3.12353 2.34673C3.68934 2 4.45956 2 6 2C7.54044 2 8.31066 2 8.87647 2.34673C9.19307 2.54074 9.45926 2.80693 9.65327 3.12353C10 3.68934 10 4.45956 10 6C10 7.54044 10 8.31066 9.65327 8.87647C9.45926 9.19307 9.19307 9.45926 8.87647 9.65327C8.31066 10 7.54044 10 6 10C4.45956 10 3.68934 10 3.12353 9.65327C2.80693 9.45926 2.54074 9.19307 2.34673 8.87647C2 8.31066 2 7.54044 2 6Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M14 6C14 4.45956 14 3.68934 14.3467 3.12353C14.5407 2.80693 14.8069 2.54074 15.1235 2.34673C15.6893 2 16.4596 2 18 2C19.5404 2 20.3107 2 20.8765 2.34673C21.1931 2.54074 21.4593 2.80693 21.6533 3.12353C22 3.68934 22 4.45956 22 6C22 7.54044 22 8.31066 21.6533 8.87647C21.4593 9.19307 21.1931 9.45926 20.8765 9.65327C20.3107 10 19.5404 10 18 10C16.4596 10 15.6893 10 15.1235 9.65327C14.8069 9.45926 14.5407 9.19307 14.3467 8.87647C14 8.31066 14 7.54044 14 6Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </Button>
        </div>
      </div>
      <Modal
        isOpen={modelMenuOpen || !isLoggedIn}
        hideCloseButton
        onOpenChange={setModelMenuOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-10 dark bg-background text-foreground  ">
                <div className=" flex w-full pb-10 font-semibold text-xl justify-center items-center gap-3">
                  <Image
                    src="/android-chrome-192x192.png"
                    width={"36"}
                    height={"36"}
                    className=" object-cover rounded-full "
                    alt="SubsIRL - Subtitles in real life Logo"
                  />
                  SubsIRL
                </div>
                <div className=" flex w-full justify-center items-center gap-5">
                  {isLoggedIn ? (
                    <>
                      <SignedIn>
                        <Button isIconOnly size="lg" variant="faded">
                          <UserButton />
                        </Button>
                      </SignedIn>
                    </>
                  ) : (
                    <div className="w-full flex flex-col justify-center items-center gap-3">
                      <div className="text-center text-default-600 ">
                        Please Login to use SubsIRL
                      </div>
                      <SignedOut>
                        <div className=" border p-3 py-2 rounded-xl shadow-md ">
                          <SignInButton />
                        </div>
                      </SignedOut>
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-center pt-5">
                  <BottomFooter />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </ShineBorder>
  );
}
