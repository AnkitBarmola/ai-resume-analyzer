import { useMockStore } from "~/lib/puter";
import {useEffect} from "react";
import { useLocation, useNavigate } from "react-router";

const Auth = () => {
    const { isLoading, auth } = useMockStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            const next = new URLSearchParams(location.search).get('next') || '/';
            navigate(next);
        }
    }, [auth.isAuthenticated]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Demo Mode - Auth skipped</h1>
            <button onClick={async () => {
                await auth.signIn();
            }}>
                Sign In (Mock)
            </button>
        </div>
    );
};

export default Auth;

