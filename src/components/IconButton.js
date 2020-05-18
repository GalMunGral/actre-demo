import { Button, Icon } from "./IconButtonComponents";

const IconButton = () => ({ type, onclick }) =>
  // use transform
  Button(
    (onclick = onclick),
    (onmousedown = (e) => e.stopPropagation()),
    (onmouseup = (e) => e.stopPropagation()),
    [Icon((className = `fas fa-${type}`))]
  );

export default IconButton;
