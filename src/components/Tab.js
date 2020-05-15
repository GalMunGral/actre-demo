import css from "../lib/css";

const colorMap = {
  primary: "#f44336",
  social: "#2962ff",
  promotions: "#2e7d32",
};

const iconMap = {
  primary: "inbox",
  social: "user-friends",
  promotions: "tag",
};

const icon = css`
  margin: 0 20px;
`;

const tab = css`
  --height: 55px;
  display: inline-block;
  position: relative;
  height: var(--height);
  line-height: var(--height);
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: start;
  text-transform: capitalize;
  width: 250px;
  color: ${({ active, name }) => (active ? colorMap[name] : "gray")};
  cursor: pointer;
  transition: background 0.02s ease-in-out;
`.and`::after {
  content: "";
  position: absolute;
  left: 5%;
  bottom: 0;
  border-radius: 3px 3px 0 0;
  width: 90%;
  height: 3px;
  background: ${({ active, name }) =>
    active ? colorMap[name] : "transparent"};
}`.and`:hover {
  background: var(--light-gray);
}`;

const Tab = () => ({ name, key, onclick, active }) => {
  return (
    // use transform
    div((className = tab({ active, name })), (key = key), (onclick = onclick), [
      i((className = `fas fa-${iconMap[name]} ${icon()}`)),
      p(name),
    ])
  );
};

export default Tab;
