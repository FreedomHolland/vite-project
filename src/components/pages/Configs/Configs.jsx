import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import "./styles.scss";

export default function Configs() {
  const quantity = 100;

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#65C466",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

  const mainWaterSwich = (value) => {
    console.log(value);
  };

  const tastes = [
    { title: "Taste 1", quantity: 100 },
    { title: "Taste 2", quantity: 100 },
    { title: "Taste 3", quantity: 100 },
  ];

  return (
    <div className="configs-container">
      <div className="right-side">
        <div className="main">
          <span className="text">Main water</span>
          <IOSSwitch
            onChange={(event) => mainWaterSwich(event.target.checked)}
          />
          <span className="total">{`xxx: ${quantity} ml`}</span>
        </div>
        <div className="tastes">
          {tastes.map((taste) => (
            <div className="taste">
              <span className="text">{taste.title}</span>
              <IOSSwitch
                onChange={(event) => mainWaterSwich(event.target.checked)}
              />
              <span className="total">{`xxx: ${quantity} ml`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
