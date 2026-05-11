export const ThrowErrorButton = ({ handleClick }: { handleClick: () => void }) => {
    return (
        <button
            className="error-button"
            onClick={handleClick}
        >
            Throw error
        </button>)
}