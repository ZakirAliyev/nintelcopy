import * as React from "react";
import {Outlet, useLocation} from "react-router-dom";
import Header from "../header/Header";
import ScrollTop from "../utils/ScrollToTop";
import {styled, useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {Link} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import InventoryIcon from "@mui/icons-material/Inventory";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutButton from "../auth/LogoutButton";
import LogoutIcon from "@mui/icons-material/Logout";
import useMediaQuery from "@mui/material/useMediaQuery";
import {BsTv} from "react-icons/bs";

const drawerWidth = 240;

const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})(
    ({theme, open}) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
);
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
const DrawerHeader = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

function RootLayout() {
    return (
        <div>
            <ScrollTop/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}

export default function PersistentDrawerLeft() {
    const location = useLocation();
    const hideHeader =
        location.pathname.includes("register") ||
        location.pathname.includes("signin") ||
        location.pathname.includes("forgotpassword") ||
        location.pathname.includes("password-reset") ||
        location.pathname.includes("reset-password") ||
        location.pathname.includes("confirm-email") ||
        location.pathname.includes("newlogin") ||
        location.pathname.includes("error");
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {!hideHeader ? (
                <Box sx={{display: "flex", minHeight: "100vh"}}>
                    <CssBaseline/>
                    <AppBar
                        position="fixed"
                        open={open}
                        sx={{backgroundColor: "#36394c"}}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{mr: 2, ...(open && {display: "none"})}}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Header/>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            "& .MuiDrawer-paper": {
                                width: drawerWidth,
                                boxSizing: "border-box",
                                backgroundColor: "#36394c",
                                color: "white",
                            },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                        <DrawerHeader>
                            <IconButton sx={{color: "#ffffff"}} onClick={handleDrawerClose}>
                                {theme.direction === "ltr" ? (
                                    <ChevronLeftIcon/>
                                ) : (
                                    <ChevronRightIcon/>
                                )}
                            </IconButton>
                        </DrawerHeader>
                        <Divider/>
                        <List>
                            <ListItemButton
                                component={Link}
                                to="/"
                                onClick={isSmallScreen ? handleDrawerClose : null}
                            >
                                <ListItemIcon sx={{color: "#ffffff"}}>
                                    <HomeIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Dashboard"/>
                            </ListItemButton>
                            <ListItemButton
                                component={Link}
                                to="/topics-list"
                                onClick={isSmallScreen ? handleDrawerClose : null}
                            >
                                <ListItemIcon sx={{color: "#ffffff"}}>
                                    <FormatListBulletedIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Topics list"/>
                            </ListItemButton>
                            <ListItemButton
                                component={Link}
                                to="/compare-keywords"
                                onClick={isSmallScreen ? handleDrawerClose : null}
                            >
                                <ListItemIcon sx={{color: "#ffffff"}}>
                                    <CompareArrowsIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Compare keywords"/>
                            </ListItemButton>
                            <ListItemButton
                                component={Link}
                                to="/packages"
                                onClick={isSmallScreen ? handleDrawerClose : null}
                            >
                                <ListItemIcon sx={{color: "#ffffff"}}>
                                    <InventoryIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Packages"/>
                            </ListItemButton>
                            <ListItemButton
                                component={Link}
                                to="/tv-radio"
                                onClick={isSmallScreen ? handleDrawerClose : null}
                            >
                                <ListItemIcon sx={{color: "#ffffff"}}>
                                    <BsTv style={{
                                        fontSize: "20px",
                                        marginLeft: '3px'
                                    }}/>
                                </ListItemIcon>
                                <ListItemText primary="TV and Radio"/>
                            </ListItemButton>

                            {isSmallScreen && (
                                <>
                                    <ListItemButton
                                        component={Link}
                                        to="/settings"
                                        onClick={isSmallScreen ? handleDrawerClose : null}
                                    >
                                        <ListItemIcon sx={{color: "#ffffff"}}>
                                            <SettingsIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Settings"/>
                                    </ListItemButton>
                                    <ListItemButton onClick={handleDrawerClose}>
                                        <ListItemIcon sx={{color: "#ffffff"}}>
                                            <LogoutIcon/>
                                        </ListItemIcon>
                                        <LogoutButton style={{padding: 0}}/>
                                    </ListItemButton>
                                </>
                            )}
                        </List>
                        <Divider/>
                    </Drawer>
                    <Main open={open} sx={{backgroundColor: "#222736"}}>
                        <DrawerHeader/>
                        <RootLayout/>
                    </Main>
                </Box>
            ) : (
                <RootLayout/>
            )}
        </div>
    );
}
