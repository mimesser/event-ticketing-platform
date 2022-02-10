import Backdrop from "@mui/material/Backdrop";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ReplyIcon from "@mui/icons-material/Reply";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "boring-avatars";
import Layout from "components/Layout";
import copy from "copy-to-clipboard";
import { useUser } from "lib/hooks";
import { shortenAddress, stopPropagation } from "lib/utils";
import moment from "moment";
import React from "react";
import styles from "styles/pages/Profile.module.scss";

function Profile() {
  const user = useUser({ redirectTo: "/" });

  const [snackShow, openSnackBar] = React.useState(false);
  const copyAddress = async () => {
    copy(user.publicAddress);
    openSnackBar(true);
  };

  const [anchorElShare, setAnchorElShare] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenShareMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElShare(event.currentTarget);
  };
  const handleCloseShareMenu = () => {
    setAnchorElShare(null);
  };

  const [linkCopied, copyLink] = React.useState(false);
  const copyShareLink = () => {
    let username = user.publicAddress;
    if (user.username) username = user.username;
    copy(process.env.NEXT_PUBLIC_URL + username);
    copyLink(true);
    setTimeout(() => {
      handleCloseShareMenu();
      copyLink(false);
    }, 500);
  };

  const [photo, setPhoto] = React.useState("");
  const [photoModal, showPhotoModal] = React.useState(false);
  const updatePhoto = (item: string) => {
    setPhoto(item);
    showPhotoModal(true);
  };

  return (
    <Layout>
      {user && (
        <div className={styles.profile_page}>
          <div
            className={styles.banner}
            onClick={() => updatePhoto("banner")}
          ></div>

          <div className={styles.avatar} onClick={() => updatePhoto("avatar")}>
            <Avatar
              size={80}
              name={user.public}
              variant="pixel"
              colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
            />
          </div>

          <div className={styles.menu}>
            <div className={styles.edit}>Edit profile</div>
            <div className={styles.share} onClick={handleOpenShareMenu}>
              <ReplyIcon />
            </div>
          </div>

          <div className={styles.address}>
            {shortenAddress(user.publicAddress)}
            {snackShow ? (
              <CheckIcon />
            ) : (
              <ContentCopyIcon className={styles.copy} onClick={copyAddress} />
            )}
          </div>

          <div className={styles.active}>
            Joined
            <span className={styles.since}>
              {moment(user.createdAt).format("MMMM YYYY")}
            </span>
          </div>
        </div>
      )}

      <Snackbar
        open={snackShow}
        autoHideDuration={1000}
        onClose={() => openSnackBar(false)}
        message="Copied to clipboard"
      />

      <Menu
        sx={{ mt: "45px" }}
        anchorEl={anchorElShare}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElShare)}
        onClose={handleCloseShareMenu}
      >
        <MenuItem onClick={copyShareLink}>
          <ListItemIcon>
            {linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
          </ListItemIcon>
          {linkCopied ? "Link Copied" : "Copy Link"}
        </MenuItem>
      </Menu>

      <Backdrop
        sx={{
          background: "rgba(61, 64, 51, 0.9)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={photoModal}
        onClick={() => showPhotoModal(false)}
      >
        <div className={styles.backdrop}>
          {photo === "avatar" ? (
            <div className={styles.avatar} onClick={stopPropagation}>
              <Avatar
                size={240}
                name={user.public}
                variant="pixel"
                colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
              />
            </div>
          ) : (
            <div className={styles.banner} onClick={stopPropagation}></div>
          )}
          <div className={styles.close}>
            <IconButton
              aria-label="close"
              sx={{
                backgroundColor: "rgba(61, 64, 51, 0.75)",
                color: "white",
                width: "36px",
                height: "36px",
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </Backdrop>
    </Layout>
  );
}

export default Profile;
