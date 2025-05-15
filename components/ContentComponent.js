import {useSession} from "next-auth/react";
export default function ContentComponent({children}) {
    const {data: session, status} = useSession();
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
