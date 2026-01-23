import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReduxAuthor } from '../../hooks';
import { useReduxDispatch } from '../../hooks';

import * as authSlice from '../../slices/auth.slice';
import * as tasksSlice from '../../slices/tasks.slice';
import * as todosSlice from '../../slices/todos.slice';


export function UserMenu() {
    const [
        isOpen,
        setIsOpen
    ] = React.useState(false);
    const ref
        = React.useRef<HTMLDivElement>(null);

    //#region Redux
    const {
        author,
    } = useReduxAuthor();
    const dispatch
        = useReduxDispatch();
    //#endregion

    const navigate
        = useNavigate();

    //#region useEffect
    // close on click outside
    React.useEffect(() => {
        const handler
            = (e: MouseEvent) => {
                if (!ref.current?.contains(e.target as Node)) {
                    setIsOpen(false);
                }
            };

        document.addEventListener(
            'mousedown',
            handler);

        return () => document.removeEventListener(
            'mousedown',
            handler);
    }, []);
    //#endregion

    return (
        <div
            ref={ref}
            className="relative"
            onClick={(e) => {
                e.stopPropagation();
                setIsOpen(v => !v);
            }}
        >
            {/* trigger */}
            <button
                className="w-10 h-10
                flex items-center justify-center
                rounded-full border-2 border-primary/20
                hover:bg-primary/5"
            >
                <i className="fa-solid fa-user text-lg" />
            </button>

            {/* dropdown */}
            {isOpen && (
                <div
                    className="absolute top-10 z-[1]
                    w-auto
                    border rounded-md shadow-lg"
                >
                    {author ? (
                        <button
                            data-ui="link-logout"
                            className="w-10 h-10
                            group relative 
                            flex items-center justify-center
                            rounded-full border-2 border-primary/20
                            overflow-hidden"
                            onClick={async () => {
                                await dispatch(authSlice.asyncThunk.logout())
                                    .unwrap();

                                dispatch(tasksSlice.reset());
                                dispatch(todosSlice.reset());
                                navigate('/');
                            }}
                        >
                            <div
                                className="absolute translate-x-[35%]
                                flex items-center gap-2                    
                                group-hover:translate-x-[-30%]
                                transition-transform duration-300"
                            >

                                <i className="text-[20px] fa-solid fa-right-from-bracket" />

                                <p className="text-xs font-medium leading-none">
                                    Log out
                                </p>
                            </div>
                        </button>
                    ) : (
                        <>
                            <Link
                                data-ui="link-login"
                                to="/login"
                                className="w-10 h-10
                                group relative 
                                flex items-center justify-center
                                rounded-full border-2 border-primary/20
                                overflow-hidden"
                            >
                                <div
                                    className="absolute translate-x-[35%]
                                    flex items-center gap-2
                                    group-hover:translate-x-[-30%]
                                    transition-transform duration-300"
                                >
                                    <i className="text-[20px] fa-solid fa-right-to-bracket" />

                                    <p className="text-xs font-medium leading-none">
                                        Log in
                                    </p>
                                </div>
                            </Link>

                            <Link
                                data-ui="link-sigup"
                                to="/signup"
                                className="w-10 h-10
                                group relative 
                                flex items-center justify-center
                                rounded-full border-2 border-primary/20
                                overflow-hidden"
                            >
                                <div
                                    className="absolute translate-x-[35%]
                                    flex items-center gap-2                    
                                    group-hover:translate-x-[-25%]
                                    transition-transform duration-300"
                                >
                                    <i className="fa-solid fa-user-plus" />

                                    <p className="text-xs font-medium leading-none">
                                        Sign up
                                    </p>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
