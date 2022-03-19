import "./style.css";
// import ListIcon from "@mui/icons-material/TableRows";
import ListIcon from "@mui/icons-material/List";
// import GridIcon from "@mui/icons-material/Window";
import GridIcon from "@mui/icons-material/ViewComfy";

export default function ViewToggleButtons(props) {
  const { setViewType, viewType } = props;

  return (
    <div className="view_toggle_buttons">
      <ListIcon
        style={{ fontSize: "2rem" }}
        className={`${
          viewType === "list" && "view_toggle_selected"
        } view_toggle_left`}
        onClick={() => setViewType("list")}
      />
      <GridIcon
        style={{ fontSize: "2rem" }}
        className={`${
          viewType === "grid" && "view_toggle_selected"
        } view_toggle_right`}
        onClick={() => setViewType("grid")}
      />
    </div>
  );
}
