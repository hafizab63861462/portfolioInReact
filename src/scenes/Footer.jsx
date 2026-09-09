import SocialMediaIcons from "../components/SocialMediaIcons";
import Year from "../components/Year";

const Footer = () => {
  return (
    <footer style={{ background: "#05003a" }}>
      {/* gradient top accent line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, #24CBFF 14.53%, #FC59FF 69.36%, #FFBD0C 117.73%)",
        }}
      />

      <div className="w-10/12 mx-auto py-10">
        <div className="md:flex md:justify-between md:items-center gap-8">
          {/* LEFT — name & tagline */}
          <div className="mb-8 md:mb-0">
            <p className="font-playfair font-bold text-2xl text-white">
              Hafiz Abdullah
            </p>
            <p className="font-opensans text-sm text-dark-grey mt-1">
              Full-Stack Software Engineer
            </p>
            <p className="font-opensans text-sm text-dark-grey mt-0.5">
              +92 321 4365740
            </p>
          </div>

          {/* CENTER — social icons */}
          <div className="mb-8 md:mb-0">
            <SocialMediaIcons />
          </div>

          {/* RIGHT — availability */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <p className="text-sm font-opensans text-grey">Open to work</p>
            </div>
            <p className="font-opensans text-xs text-dark-grey">
              © <Year /> Hafiz Abdullah. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
