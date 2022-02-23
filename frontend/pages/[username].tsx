import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import ReplyIcon from "@mui/icons-material/Reply";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Avatar from "boring-avatars";
import Layout from "components/Layout";
import copy from "copy-to-clipboard";
import { fetchPublicUser } from "lib/hooks";
import {
  checkUsernameEqual,
  isProduction,
  shortenAddress,
  stopPropagation,
} from "lib/utils";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import styles from "styles/pages/Profile.module.scss";

function Profile() {
  const [loading, finishLoading] = React.useState(true);

  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (username) {
      fetchPublicUser(username as string).then((fetchedUser) => {
        setUser(fetchedUser);
        finishLoading(false);
      });
    }
  }, [username]);

  const [snackShow, openSnackBar] = React.useState(false);
  const copyAddress = async () => {
    copy(user.walletAddress);
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
    let username = user.walletAddress;
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

  const [discardModal, showDiscardModal] = React.useState(false);
  const discardModalClose = () => {
    showDiscardModal(false);
  };
  const discard = () => {
    showDiscardModal(false);
    showEditProfile(false);
  };

  const [profileModal, showEditProfile] = React.useState(false);
  const editProfile = () => {
    setNewName(user.name);
    setNewUsername(user.username);
    invalidateUsername(false);
    setNewAvatar(user.avatarImage);
    setNewBanner(user.bannerImage);
    showEditProfile(true);
  };
  const editModalClose = () => {
    if (
      !checkUsernameEqual(user.username, newUsername) ||
      !checkUsernameEqual(user.name, newName) ||
      user.avatarImage !== newAvatar ||
      user.bannerImage !== newBanner
    ) {
      showDiscardModal(true);
    } else {
      showEditProfile(false);
    }
  };
  const saveProfile = async () => {
    if (invalidUsername) return;
    const response = await (
      await fetch("/api/update-profile", {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          name: newName,
          username: newUsername,
          avatarImage: newAvatar,
          bannerImage: newBanner,
        }),
      })
    ).json();
    if (response.user) {
      showEditProfile(false);
      router.reload();
    }
    if (response.error) {
      invalidateUsername(true);
    }
  };

  const [newName, setNewName] = React.useState("");
  const nameUpdated = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.length > 50) return;
    setNewName(event.target.value);
  };

  const [newUsername, setNewUsername] = React.useState("");
  const usernameUpdated = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.length > 50) return;
    invalidateUsername(false);
    setNewUsername(event.target.value);
  };
  const [invalidUsername, invalidateUsername] = React.useState(false);
  const checkUsername = async () => {
    const userExists =
      !checkUsernameEqual(user.username, newUsername) &&
      ((
        await (
          await fetch("/api/check-username", {
            method: "POST",
            body: JSON.stringify({
              username: newUsername,
            }),
          })
        ).json()
      ).user ??
        false);
    invalidateUsername(!!userExists);
  };

  const [selectedPhoto, selectPhoto] = React.useState("");
  const [newAvatar, setNewAvatar] = React.useState("");
  const [newBanner, setNewBanner] = React.useState("");

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target?.files[0];

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

      if (selectedPhoto === "avatar") setNewAvatar(url + fields.key);
      if (selectedPhoto === "banner") setNewBanner(url + fields.key);
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

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>
          <CircularProgress size={120} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.profile_page}>
        {user ? (
          <div className={styles.banner} onClick={() => updatePhoto("banner")}>
            {user.bannerImage && (
              <Image
                src={user.bannerImage}
                layout="fill"
                objectFit="cover"
                alt="Banner"
              />
            )}
          </div>
        ) : (
          <div className={styles.nobanner}></div>
        )}

        {user ? (
          <div className={styles.avatar} onClick={() => updatePhoto("avatar")}>
            {user.avatarImage ? (
              <Image
                src={user.avatarImage}
                width={80}
                height={80}
                alt="Avatar"
              />
            ) : (
              <Avatar
                size={80}
                name={user.walletAddress}
                variant="pixel"
                colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
              />
            )}
          </div>
        ) : (
          <div className={styles.noavatar}></div>
        )}

        <div
          className={styles.menu}
          style={{ display: user?.authenticated ? "flex" : "none" }}
        >
          <Tooltip title="Edit Profile">
            <Button
              color="inherit"
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
                margin: theme.spacing(1),
              })}
              variant="outlined"
              onClick={editProfile}
            >
              <Typography
                sx={{
                  fontFamily: "sans-serif",
                  fontSize: "16px",
                  fontWeight: 550,
                  textTransform: "none",
                }}
                variant="body1"
              >
                Edit profile
              </Typography>
            </Button>
          </Tooltip>

          <Tooltip title="Share Profile">
            <Button
              color="inherit"
              variant="outlined"
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
                margin: theme.spacing(1),
                [theme.breakpoints.down("md")]: {
                  maxWidth: "30px",
                },
              })}
              onClick={handleOpenShareMenu}
            >
              <ReplyIcon />
            </Button>
          </Tooltip>
        </div>
        <div className={styles.user_details}>
          <div className={styles.address}>
            {shortenAddress(user?.walletAddress || username)}
            {user && (
              <>
                {snackShow ? (
                  <CheckIcon />
                ) : (
                  <Tooltip title="Copy Address">
                    <ContentCopyIcon
                      className={styles.copy}
                      onClick={copyAddress}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </div>
        </div>

        {user ? (
          <div className={styles.active}>
            Joined
            <span className={styles.since}>
              {moment(user.createdAt).format("MMMM YYYY")}
            </span>
          </div>
        ) : (
          <div className={styles.nouser}>
            <div>
              <div className={styles.noexist}>
                This account doesn&apos;t exist
              </div>
              <div className={styles.trysearch}>Try searching for another.</div>
            </div>
          </div>
        )}
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
        PaperProps={{
          sx: { borderRadius: (theme) => theme.shape.borderRadius },
        }}
      >
        <MenuItem onClick={copyShareLink}>
          <ListItemIcon>
            {linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
          </ListItemIcon>
          {linkCopied ? "Link Copied" : "Copy Link"}
        </MenuItem>
      </Menu>

      {user && (
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
                {user.avatarImage ? (
                  <Image
                    src={user.avatarImage}
                    width={240}
                    height={240}
                    alt="Avatar"
                  />
                ) : (
                  <Avatar
                    size={240}
                    name={user.walletAddress}
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
              </div>
            ) : (
              <div className={styles.banner} onClick={stopPropagation}>
                {user.bannerImage && (
                  <Image
                    src={user.bannerImage}
                    layout="fill"
                    objectFit="cover"
                    alt="Banner"
                  />
                )}
              </div>
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
      )}

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
            <div className={styles.save_btn} onClick={saveProfile}>
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
            <div className={styles.dim} />
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
                <Image src={newAvatar} width={80} height={80} alt="Avatar" />
              ) : (
                <Avatar
                  size={80}
                  name={user?.walletAddress}
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
              <div className={styles.dim} />
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
            label="Name"
            variant="outlined"
            className={styles.name}
            value={newName}
            onChange={nameUpdated}
          />

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

      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={discardModalClose}
        open={discardModal}
      >
        <div className={styles.discard_modal}>
          <span className={styles.title}>Discard changes?</span>
          <span className={styles.content}>
            This can&apos;t be undone and you&apos;ll lose your changes.
          </span>
          <span className={styles.discard} onClick={discard}>
            Discard
          </span>
          <span className={styles.cancel} onClick={discardModalClose}>
            Cancel
          </span>
        </div>
      </Modal>
    </Layout>
  );
}

export default Profile;
