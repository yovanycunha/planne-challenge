import React, { ChangeEvent } from "react";
import styles from "./Input.module.scss";
import { IInputProps } from "./types";

const Input: React.FC<IInputProps> = (props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(e);
  };

  return (
    <div className={styles.container}>
      <label htmlFor={props.name} className={styles.label}>
        {props.label}
      </label>
      <input
        type="text"
        placeholder={props.placeholder}
        onChange={handleChange}
        className={styles.input}
        id={props.name}
      />
      <span className={styles.hint}>{props.hint}</span>
    </div>
  );
};

export default Input;
