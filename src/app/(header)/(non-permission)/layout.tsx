import HeaderPublicNonPermissionLayoutClient from "@components/Templates/HeaderPublicNonPermissionLayout copy";

export const dynamic = 'force-dynamic';


export default async function HeaderPublicNonPermissionLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <HeaderPublicNonPermissionLayoutClient>
            {children}
        </HeaderPublicNonPermissionLayoutClient>

    );
}
