export function Footer() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_URL;
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-10 text-center text-xs text-slate-500">
      <p>
        DevCard uses public GitHub data. Not affiliated with GitHub or EA Sports.
        {contact ? (
          <>
            {" "}
            <a href={contact} className="underline hover:text-slate-300">
              Remove my card
            </a>
          </>
        ) : null}
      </p>
    </footer>
  );
}