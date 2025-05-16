import {redirect} from 'next/navigation';

const basePathToUse = process.env.GHREPO !== undefined ? "/" + process.env.GHREPO : "";

export default function HomePage() {
  redirect(`${basePathToUse}/docs/core`)
}
