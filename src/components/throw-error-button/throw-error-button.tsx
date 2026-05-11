export const ThrowErrorButton = () => {
    return (
    <button
        className="error-button"
        onClick={() => { throw new Error('Test error') }}
    >
        Throw error
    </button>)
}