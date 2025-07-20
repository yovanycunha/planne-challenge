import { ChangeEvent } from "react";

export interface IInputProps {
  placeholder: string;
  name: string;
  label?: string;
  hint?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
