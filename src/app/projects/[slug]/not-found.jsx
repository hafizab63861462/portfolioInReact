import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="bg-deep-blue min-h-screen pt-28 pb-20">
      <div className="w-5/6 max-w-2xl mx-auto text-center">
        <p className="font-playfair font-bold text-6xl text-yellow mb-4">404</p>
        <h1 className="font-playfair font-semibold text-3xl text-white mb-4">
          Project not found
        </h1>
        <p className="font-opensans text-grey mb-10">
          That project doesn&apos;t exist or has been renamed.
        </p>
        <Link
          href="/#projects"
          className="bg-gradient-rainblue text-deep-blue rounded-sm py-3 px-7 font-semibold font-opensans
            hover:bg-blue hover:text-white transition duration-500"
        >
          View All Projects
        </Link>
      </div>
    </div>
  );
}
