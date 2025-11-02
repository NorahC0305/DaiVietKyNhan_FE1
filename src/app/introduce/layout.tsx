import IntroduceLayoutClient from "@components/Templates/IntroduceLayout";

export default function IntroduceLayoutServer({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <IntroduceLayoutClient>
                {children}
            </IntroduceLayoutClient>
        </>
    );
}
