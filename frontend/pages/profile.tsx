import Backdrop from "@mui/material/Backdrop";
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import ReplyIcon from "@mui/icons-material/Reply";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Avatar from "boring-avatars";
import Layout from "components/Layout";
import copy from "copy-to-clipboard";
import { useUser } from "lib/hooks";
import { isProduction, shortenAddress, stopPropagation } from "lib/utils";
import moment from "moment";
import Image from "next/image";
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

  const [profileModal, showEditProfile] = React.useState(false);
  const editProfile = () => {
    setNewUsername(user.username);
    invalidateUsername(false);
    setNewAvatar("");
    setNewBanner("");
    showEditProfile(true);
  };
  const editModalClose = () => {
    showEditProfile(false);
  };

  const [newUsername, setNewUsername] = React.useState("");
  const usernameUpdated = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    invalidateUsername(false);
    setNewUsername(event.target.value);
  };
  const [invalidUsername, invalidateUsername] = React.useState(false);
  const checkUsername = async () => {
    const userExists =
      (
        await (
          await fetch("/api/check-username", {
            method: "POST",
            body: JSON.stringify({
              username: newUsername,
            }),
          })
        ).json()
      ).user ?? false;
    invalidateUsername(!!userExists);
  };

  const [selectedPhoto, selectPhoto] = React.useState("");
  const [newAvatar, setNewAvatar] = React.useState("");
  const [newBanner, setNewBanner] = React.useState("");

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target?.files[0];

    if (selectedPhoto === "avatar") setNewAvatar(URL.createObjectURL(file));
    if (selectedPhoto === "banner") setNewBanner(URL.createObjectURL(file));

    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-image?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
      mode: isProduction ? undefined : "no-cors",
    });

    if (upload.ok || upload.type === "opaque") {
      console.log("Uploaded successfully!");
    } else {
      console.error("Upload failed.");
    }
  };

  const [bannerRef, setBannerRef] = React.useState<HTMLInputElement | null>(
    null
  );
  const uploadBanner = () => {
    selectPhoto("banner");
    bannerRef?.click();
  };
  const [avatarRef, setAvatarRef] = React.useState<HTMLInputElement | null>(
    null
  );
  const uploadAvatar = () => {
    selectPhoto("avatar");
    avatarRef?.click();
  };
  const removeBanner = () => {
    setNewBanner("");
  };

  return (
    <Layout>
      {user && (
        <>
          <div className={styles.profile_page}>
            <div
              className={styles.banner}
              onClick={() => updatePhoto("banner")}
            ></div>

            <div
              className={styles.avatar}
              onClick={() => updatePhoto("avatar")}
            >
              <Avatar
                size={80}
                name={user.publicAddress}
                variant="pixel"
                colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
              />
            </div>

            <div className={styles.menu}>
              <div className={styles.edit} onClick={editProfile}>
                Edit profile
              </div>
              <div className={styles.share} onClick={handleOpenShareMenu}>
                <ReplyIcon />
              </div>
            </div>

            <div className={styles.address}>
              {shortenAddress(user.publicAddress)}
              {snackShow ? (
                <CheckIcon />
              ) : (
                <ContentCopyIcon
                  className={styles.copy}
                  onClick={copyAddress}
                />
              )}
            </div>

            <div className={styles.active}>
              Joined
              <span className={styles.since}>
                {moment(user.createdAt).format("MMMM YYYY")}
              </span>
            </div>
          </div>

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
                    name={user.publicAddress}
                    variant="pixel"
                    colors={[
                      "#ffad08",
                      "#edd75a",
                      "#73b06f",
                      "#0c8f8f",
                      "#405059",
                    ]}
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

          <Modal
            BackdropProps={{
              timeout: 500,
            }}
            closeAfterTransition
            onClose={editModalClose}
            open={profileModal}
          >
            <div className={styles.profile_modal}>
              <div className={styles.header}>
                <div className={styles.header_title}>
                  <CloseIcon onClick={editModalClose} />
                  <span>Edit Profile</span>
                </div>
                <div className={styles.save_btn} onClick={editModalClose}>
                  Save
                </div>
              </div>

              <div className={styles.banner}>
                {newBanner && (
                  <Image
                    src={newBanner}
                    layout="fill"
                    objectFit="cover"
                    alt="Banner"
                  />
                )}
                <div className={styles.icon_set}>
                  <CameraEnhanceIcon
                    className={styles.icon}
                    onClick={uploadBanner}
                  />
                  {newBanner && (
                    <CloseIcon className={styles.icon} onClick={removeBanner} />
                  )}
                  <input
                    ref={(input) => setBannerRef(input)}
                    onChange={uploadPhoto}
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                  />
                </div>

                <div className={styles.avatar}>
                  {newAvatar ? (
                    <Image
                      src={newAvatar}
                      width={80}
                      height={80}
                      alt="Avatar"
                    />
                  ) : (
                    <Avatar
                      size={80}
                      name={user.publicAddress}
                      variant="pixel"
                      colors={[
                        "#ffad08",
                        "#edd75a",
                        "#73b06f",
                        "#0c8f8f",
                        "#405059",
                      ]}
                    />
                  )}
                  <div className={styles.icon_set}>
                    <CameraEnhanceIcon
                      className={styles.icon}
                      onClick={uploadAvatar}
                    />
                    <input
                      ref={(input) => setAvatarRef(input)}
                      onChange={uploadPhoto}
                      type="file"
                      accept="image/png, image/jpeg"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>

              <TextField
                label="Username"
                error={invalidUsername}
                helperText={
                  invalidUsername
                    ? "That username has been taken. Please choose another."
                    : ""
                }
                variant="outlined"
                className={styles.username}
                value={newUsername}
                onChange={usernameUpdated}
                onBlur={checkUsername}
              />
            </div>
          </Modal>
        </>
      )}
    </Layout>
  );
}

export default Profile;
