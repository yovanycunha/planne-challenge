import { ChangeEvent } from "react";

export interface IInputProps {
  placeholder: string;
  name: string;
  label?: string;
  hint?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
