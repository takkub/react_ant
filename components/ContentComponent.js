export default function ContentComponent({children}) {
    return (
        <div
            style={{
                padding: 24,
                minHeight: 360,
            }}
        >
            {children}
        </div>
    );
}
