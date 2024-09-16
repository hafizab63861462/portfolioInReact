import "./business.css";

const BusinessMediaIcons = () => {
  return (
    <div className="flex flex-wrap justify-center md:justify-start my-10 gap-7">
      <a
        className="hover:opacity-50 transition duration-500 rounded-image w-full md:w-auto"
        href="https://www.upwork.com/freelancers/~0199a33c600994d315?viewMode=1&s=1110580755107926016"
        target="_blank"
        rel="noreferrer"
      >
        <img alt="upwork-link" src="assets/upwork.png" />
      </a>
      <a
        className="hover:opacity-50 transition duration-500 rounded-image w-full md:w-auto"
        href="https://www.fiverr.com/hafizabdulla377?up_rollout=true"
        target="_blank"
        rel="noreferrer"
      >
        <img alt="Fiverr-link" src="assets/Fiverr.png" />
      </a>
      <a
        className="hover:opacity-50 transition duration-500 rounded-image w-full md:w-auto"
        href="https://www.freelancer.com/u/hafizab63861462"
        target="_blank"
        rel="noreferrer"
      >
        <img alt="freelancer-link" src="assets/freelancer.webp" />
      </a>
      <a
        className="hover:opacity-50 transition duration-500 rounded-image w-full md:w-auto"
        href="https://www.guru.com/freelancers/hafiz-abdullah-naeem"
        target="_blank"
        rel="noreferrer"
      >
        <img alt="guru-link" src="assets/guru.png" />
      </a>
      <a
        className="hover:opacity-50 transition duration-500 rounded-image w-full md:w-auto"
        href="https://www.fiverr.com/s/EvNLy9"
        target="_blank"
        rel="noreferrer"
      >
        <img alt="mePoster-link" src="assets/gig.gif" />
      </a>
    </div>
  );
};

export default BusinessMediaIcons;