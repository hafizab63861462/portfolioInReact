import SocialMediaIcons from "../components/SocialMediaIcons";

const Footer = () => {
  return (
    <footer className="h-64 bg-red pt-10">
      <div className="w-10/12 mx-auto">
        <SocialMediaIcons />
        <div className="md:flex justify-center md:justify-between text-center ">
          <p className="font-playfair font-semibold text-2xl text-yellow">
            Hafiz Abdullah
            <p>+92 321 4365740</p>
          </p>

          <p className="font-playfair text-md text-yellow">
            Made By Hafiz
            <p className="text-blue">
              <a
                className="hover:opacity-50 transition duration-500"
                href="https://hafizabportfolio.netlify.app/"
                target="_blank"
                rel="noreferrer"
              >
                Other Website Link:
              </a>
            </p>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
