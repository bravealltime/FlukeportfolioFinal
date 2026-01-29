import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #10b981 2%, transparent 0%)',
                    backgroundSize: '50px 50px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                        border: '2px solid #10b981',
                        borderRadius: '20px',
                        padding: '40px 80px',
                        boxShadow: '0 0 50px rgba(16, 185, 129, 0.4)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 60,
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #10b981, #3b82f6)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: 20,
                            fontFamily: 'monospace',
                        }}
                    >
                        Tharanut Hiransrettawat
                    </div>
                    <div
                        style={{
                            fontSize: 30,
                            color: '#d1d5db',
                            fontFamily: 'sans-serif',
                            letterSpacing: '2px',
                        }}
                    >
                        Creative Code Creator // Portfolio
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            marginTop: 30,
                            gap: 10,
                        }}
                    >
                        <div style={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        <div style={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                        <div style={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#10b981' }} />
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
