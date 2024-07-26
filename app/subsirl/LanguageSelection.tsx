import { LangObj, Language, LanguageOptions } from "@/types/lang";
import { Select, SelectItem, SharedSelection } from "@nextui-org/react";

const LanguageSelection = ({
  languageSelected,
  setLanguageSelected,
}: {
  languageSelected: LangObj;
  setLanguageSelected: any;
}) => {
  return (
    <>
      <div className="flex w-full  sm:max-w-[30vw] justify-start items-center gap-3 ">
        <Select
          label="From"
          size="sm"
          variant="flat"
          radius="md"
          defaultSelectedKeys={[
            (languageSelected.fromLanguage.englishName as any) ||
              LanguageOptions[1].englishName,
          ]}
          className=" min-w-xs "
          onSelectionChange={(keys: SharedSelection) =>
            setLanguageSelected((prev: LangObj) => ({
              ...prev,
              fromLanguage: LanguageOptions?.filter(
                (item: Language) => item.englishName === keys.currentKey
              )[0],
            }))
          }
        >
          {LanguageOptions?.filter((item: Language) => item.isToEnabled)?.map(
            (item: Language) => (
              <SelectItem key={item.englishName}>{item.title}</SelectItem>
            )
          )}
        </Select>
        <Select
          size="sm"
          label="To"
          variant="flat"
          radius="md"
          placeholder="Select a Language"
          className=" min-w-xs "
          defaultSelectedKeys={[
            (languageSelected.toLanguage.englishName as any) ||
              LanguageOptions[0].englishName,
          ]}
          onSelectionChange={(keys: SharedSelection) =>
            setLanguageSelected((prev: LangObj) => ({
              ...prev,
              toLanguage: LanguageOptions?.filter(
                (item: Language) => item.englishName === keys.currentKey
              )[0],
            }))
          }
        >
          {LanguageOptions?.filter((item: Language) => item.isToEnabled).map(
            (item: Language) => (
              <SelectItem key={item.englishName}>{item.title}</SelectItem>
            )
          )}
        </Select>
      </div>
    </>
  );
};

export default LanguageSelection;
