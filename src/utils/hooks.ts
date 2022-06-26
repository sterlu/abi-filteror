import {useCallback, useState} from "react";

export const useActionWithLoading = (func:Function, deps = []) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const action = useCallback((...args:any[]) => {
        setLoading(true);
        setError('');
        return func(...args)
            .catch((err:Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [func, ...deps]);
    return {
        action,
        loading,
        error,
    };
};
