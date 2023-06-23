import { LogoutButton } from "@inrupt/solid-ui-react";

export default function Logout(){
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Success!</h1>
            <p className="text-lg mb-8">You have successfully logged in.</p>
            <LogoutButton >
                <button >
                    Logout
                </button>
            </LogoutButton>
        </div>
    );
}