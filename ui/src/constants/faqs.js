import { links } from "./constants";

const moveForward = () => {
  return (
    <p className="p-0 m-0">
      Click{" "}
      <a href={links.launchZone} target="_blank">
        here
      </a>{" "}
      to go to our Launchzone application. Most applications will be reviewed
      and get a response in about 4 business days on the status of their
      approval.
    </p>
  );
};
const getListed = () => {
  return (
    <p className="p-0 m-0">
      We try to list as many collections as possible from major marketplaces,
      and we're continuously adding new marketplaces. If your collection is
      listed on a major marketplace that we currently support but you don't see
      it on Solens,{" "}
      <a href={links.getListed} target="_blank">
        submit an application
      </a>{" "}
      to get listed.
      <br />
      <br />
      If you're an approved launchpad collection, you will be listed as soon as
      your minting completes.
    </p>
  );
};

export const faqs = [
  {
    question: "Who is Solens",
    answer: `The Solens team is a group of experienced blockchain developers that have 
    successfully and securely launched multiple NFT Collections for clients. 
    Our attention to detail is shown throughout each project, including Solens itself,
    and will ensure your launch is in good hands from A to Z.`,
  },
  {
    question: "Why use the launchpad",
    answer: `Launching an NFT Collection can be a challenging road to navigate, and even
    small mistakes can be very costly. Utilizing our launchpad service will give you 
    the peace of mind of having experts at your fingertips. Even more - the Metaplex 
    team, which created the Candy Machine, have said they recommend using Solens' 
    Launchzone because of our attention to detail for security.`,
  },
  {
    question: "What about security",
    answer: `Security is our top priority at Solens. Our developers are well versed in 
    modern blockchain languages and best security practices. For example, when creating 
    our Launchzone service we uncovered a major bug in the CMv2 contract with potentially 
    severe consequences for the entire Solana NFT ecosystem. We reported it to Metaplex, the 
    creators of the CMv2 program and got it patched immediately. Our goal is to help the 
    Solana ecosystem become more secure and mitigate the risk of scams, hacks, or errors.`,
  },
  {
    question: "When can we launch",
    answer: `Once you your application for launch is approved, our team will work with 
    you to gather the required assets, compile the smart contracts, and coordinate a 
    launch date. Since your launch will be minted through our Launchzone as a featured
    collection, we will plan out the launch schedule to make sure you have your time 
    to shine!`,
  },
  {
    question: "How to move forward",
    answer: moveForward(),
  },
  {
    question: "How to get listed on Solens",
    answer: getListed(),
  },
];

/*
We try to list as many collections as possible from major marketplaces. If 
    your collection is listed on a major marketplace that we currently support but you 
    don't see your collection on Solens, submit an application to get listed.

    */
