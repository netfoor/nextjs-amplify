"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Divider, Flex } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export default function NavBar({isSignedIn}: {isSignedIn: boolean}) {
    const [authCheck, setAuthCheck] = useState(isSignedIn);
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    useEffect(() => {
        const hubListenerCancel = Hub.listen("auth", (data) => {
            switch (data.payload.event) {
                case "signedIn":
                    setAuthCheck(true);
                    startTransition(() => {
                        router.push("/");
                    });
                    startTransition(() => {
                        router.refresh();
                    });
                    
                    break;
                case "signedOut":
                    setAuthCheck(false);
                    startTransition(() => {
                        router.push("/");
                    });
                    startTransition(() => {
                        router.refresh();
                    });
                    break;
                default:
                    break;
            }
        });
        return () => hubListenerCancel();
    }, [router]);

    const handleSignOut = async () => {
        if (authCheck) 
            await signOut();
        else 
            router.push("/signin");
    };

    const defaultRoutes = [
        { name: "Home", path: "/" },
        { name: "Add title", path: "/add", loggedIn: true },
    ]

    const routes = defaultRoutes.filter(
        (route) => route.loggedIn === authCheck || route.loggedIn === undefined
    );

    return (
        <Flex
            as="header"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            padding="1rem 2rem"
            backgroundColor="#fff"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        >
            <Flex as="nav" alignItems="center" gap="2rem" flex="1">
                {routes.map((route) => (
                    <Link key={route.path} href={route.path} style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>
                        {route.name}
                    </Link>
                ))}
            </Flex>
            <Divider orientation="vertical" height="2rem" />
            <Button
                variation="primary"
                borderRadius="2rem"
                marginLeft="2rem"
                onClick={handleSignOut}
            >
                {authCheck ? "Sign Out" : "Sign In"}
            </Button>
        </Flex>
    );
}