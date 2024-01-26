import React from 'react';
import {
    FaBandcamp,
    FaFacebook,
    FaInstagram,
    FaSpotify
} from "react-icons/fa6";
import {SiApplemusic} from "react-icons/si";

import Link from 'next/link';
import {useRouter} from 'next/router';
import {signOut, useSession} from 'next-auth/react';

const socialMediaIcons = [
    {
        icon: <FaSpotify/>,
        link: "https://open.spotify.com/artist/5ekptRlv9fHIGmf8Vuo8Qv?si=p1tJPZfiRd29574xqvTG3Q"
    },
    {
        icon: <SiApplemusic/>,
        link: "https://music.apple.com/us/artist/dead-streets/1622881159"
    },
    {
        icon: <FaBandcamp/>,
        link: "https://deadstreetspunk.bandcamp.com/album/hello-catastrophe"
    },
    {
        icon: <FaFacebook/>,
        link: "https://www.facebook.com/deadstreets"
    },
    {
        icon: <FaInstagram/>,
        link: "https://www.instagram.com/deadstreets.pnw"
    },
];
const Header: React.FC = () => {
    const router = useRouter();
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    const {data: session} = useSession();

    let options = null;

    if (!session) {
        options = (
            <div className="list-none flex gap-14 ml-32 mb-6">
                <Link href="/api/auth/signin" style={{opacity: !session ? 0 : 1}}>
                    Log in
                </Link>
            </div>
        );
    }

    if (session) {
        options = (
            <div className="list-none flex gap-14 ml-56">
                <Link href="/create">
                    <button>
                        New Event
                    </button>
                </Link>
                <button onClick={() => signOut()}>
                    Log out
                </button>
            </div>
        );
    }

    return (
        <nav className="flex justify-between items-center py-4 w-full z-10 bg-transparent"
             style={{position: 'sticky', top: 0}}>
            {options}
            <figure className="flex flex-col gap-3 mr-14 pt-4 max-[820px]:mr-4">
                {socialMediaIcons.map(({icon, link}, index) => (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                <span className="text-white text-[24px] cursor-pointer hover:text-royal_blue">
                  {icon}
                </span>
                    </a>
                ))}
            </figure>
            <style jsx>{`
                nav {
                    background-color: rgba(0, 0, 0, 0);
                    position: absolute;
                    width: 100%;
                    z-index: 10;
                }
            `}</style>
        </nav>
    );
};

export default Header;