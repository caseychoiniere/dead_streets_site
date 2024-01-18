import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
      router.pathname === pathname;

  const { data: session, status } = useSession();

  const navStyles = `
          a {
            text-decoration: none;
            color: white;
            display: inline-block;
            opacity: ${session ? 100 : 0}
          }

          p {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            //border: 1px solid var(--geist-foreground);
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }

          button {
            border: none;
          }
        `

  let right = null;

  if (!session) {
    right = (
        <div className="right">
          <Link href="/api/auth/signin" style={{opacity: !session ? 0 : 1}}>
              Log in
          </Link>
          <style jsx>{navStyles}</style>
        </div>
    );
  }

  if (session) {
    right = (
        <div className="right">
          <p>
            {session.user.name} ({session.user.email})
          </p>
          <Link href="/create">
            <button>
              New Event
            </button>
          </Link>
          <button onClick={() => signOut()}>
            Log out
          </button>
            <style jsx>{navStyles}</style>
        </div>
    );
  }

  if(status === 'loading') return <h1>"loading admin options..."</h1>

    return (
      <nav>
        {right}
        <style jsx>{`
            nav {
                display: flex;
                padding: 1rem 2rem;
                align-items: center;
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