import type { AppLoadContext } from "react-router";

export type Context = {
    // example:
    // db: {
    //     query: (sql: string) => Promise<any>;
    // };
    // env: {
    //     API_KEY: string;
    // };
};

export function createContext(): AppLoadContext {
    return {
        // example:
        // db: {
        //     query: async (sql: string) => {
        //         // Your database implementation
        //         return [];
        //     }
        // },
        // env: {
        //     API_KEY: process.env.API_KEY || ""
        // }
    };
} 