import styles from "./select-checkbox.module.scss";

const handleChangeDefault = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => { e.stopPropagation() }

type Props = {
    handleClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void,
    handleChange?: () => void,
    isChecked: boolean,
    type?: "checkbox" | "radio",
}

export const SelectCheckbox = ({
    isChecked,
    handleClick = handleChangeDefault,
    handleChange,
    type = "checkbox",
}: Props) => {
    return (
        <input
            type={type}
            className={styles.checkbox}
            onClick={handleClick}
            onChange={handleChange}
            checked={!!isChecked}
            aria-label="Select product"
        />
    )
}