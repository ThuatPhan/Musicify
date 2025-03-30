import { SuggesstionType } from "@src/types/Enums";

export type SearchSuggestion = {
  id: string;
  text: string;
  type: SuggesstionType;
};
