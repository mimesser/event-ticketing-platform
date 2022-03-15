import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import ReplyIcon from "@mui/icons-material/Reply";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "boring-avatars";
import Layout from "components/Layout";
import copy from "copy-to-clipboard";
import { ethers } from "ethers";
import Colors from "lib/colors";
import { fetchPublicUser } from "lib/hooks";
import { useUserInfo } from "lib/user-context";
import {
  checkUsernameEqual,
  isProduction,
  shortenAddress,
  stopPropagation,
} from "lib/utils";
import { magic } from "lib/magic";
import { moonPaySrc } from "lib/moon-pay";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import React from "react";
import { useForm } from "react-hook-form";
import styles from "styles/pages/Profile.module.scss";

function Profile() {
  const router = useRouter();
  const currentUser = useUserInfo();
  const { username, userExists } = router.query;
  const firstTimeUser = userExists === "false";
  const isMobile = useMediaQuery("(max-width:599px)");
  const { resolvedTheme } = useTheme();

  const [loading, finishLoading] = React.useState(true);
  const [signupFlow, setSignupFlow] = React.useState(
    firstTimeUser ? true : false
  );
  const [welcomeModal, setWelcomeModal] = React.useState(true); // Welcome modal
  const [moonPayModal, setMoonPayModal] = React.useState(false); // buy crypto on moonpay modal
  const [twitterModal, setTwitterModal] = React.useState(false); // Find frens on Twitter modal
  const [twitterButton, setTwitterButton] = React.useState(false);

  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (username) {
      fetchPublicUser(username as string).then((fetchedUser) => {
        setUser(fetchedUser);
        finishLoading(false);
      });
    }
  }, [router.asPath, username]);

  React.useEffect(() => {
    if (user && !currentUser.loading) {
      if (
        currentUser.user?.following
          .map((m: any) => m.followersId)
          .find((x: any) => x === user?.id)
      ) {
        setFollowing(true);
      }
    }
  }, [user, currentUser.loading, currentUser.user?.following]);

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

  const [following, setFollowing] = React.useState(false);
  const [linkCopied, copyLink] = React.useState(false);
  const [unfollowModal, setUnFollowModal] = React.useState(false);
  const [signInfollowModal, setSignInFollowModal] = React.useState(false);
  const [signInConnectModal, setsignInConnectModal] = React.useState(false);

  const unfollowUser = async () => {
    try {
      const res = await fetch("/api/twitter/follow", {
        method: "DELETE",
        body: JSON.stringify({
          email: currentUser.user.email,
          follow: [user.id],
        }),
      });

      if (res.status === 200) {
        user.followers.length === user.followers.length-- - 1;
        setFollowing(false);
        setUnFollowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async () => {
    if (currentUser.user !== null) {
      try {
        const res = await fetch("/api/twitter/follow", {
          method: "POST",
          body: JSON.stringify({
            email: currentUser.user.email,
            follow: [user.id],
          }),
        });

        if (res.status === 200) {
          user.followers.length === user.followers.length++ + 1;
          setFollowing(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setSignInFollowModal(true);
    }
  };

  const [signingIn, setSigningIn] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: any = async ({ email }: { email: any }) => {
    setSigningIn(true);

    try {
      const userExists = (
        await (
          await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          })
        ).json()
      ).user
        ? true
        : false;

      const redirectURI = `${window.location.origin}/callback${router.asPath}/${email}/${userExists}`;

      const didToken = await magic?.auth.loginWithMagicLink({
        email,
        redirectURI,
      });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 200) {
        // Create user signup notifications
        if (!userExists) {
          await fetch("/api/signup-notifications", {
            method: "POST",
            body: JSON.stringify({
              email,
            }),
          });
        }

        // redirect
        router.reload();
        setSigningIn(false);
      } else {
        // display an error
        setSigningIn(false);
      }
    } catch (error) {
      setSigningIn(false);
    }
  };

  const modalClose = () => {
    setSignupFlow(false);
    setWelcomeModal(false);
    setMoonPayModal(false);
  };

  // Buy crypto modal to find frens on Twitter modal
  const continueToTwitter = () => {
    setMoonPayModal(false);
    setTwitterModal(true);
  };

  // MoonPay modal to to buy crypto
  const continueToMoonPayModal = () => {
    setWelcomeModal(false);
    setMoonPayModal(true);
    getUsersBalance();
  };

  //check users balance after moonplay load and show twitter button upon change in account balance
  const getUsersBalance = async () => {
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    );

    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const balance = await provider.getBalance(userAddress);
    let timer = setInterval(async () => {
      const currentUserAddress = await signer.getAddress();
      const currentUserBalance = await provider.getBalance(currentUserAddress);
      if (currentUserBalance.gt(balance)) {
        setTwitterButton(true);
        clearInterval(timer);
      }
    }, 250);
  };

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

  const [addressCopied, copyWalletAddress] = React.useState(false);
  const copyShareAddress = () => {
    copy(user.walletAddress);
    copyWalletAddress(true);
    setTimeout(() => {
      handleCloseShareMenu();
      copyWalletAddress(false);
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
      if (response.user.username !== user.username) {
        finishLoading(true);
        if (response.user.username) {
          await router.push({
            pathname: "/[username]",
            query: { username: response.user.username },
          });
        } else {
          await router.push({
            pathname: "/[username]",
            query: { username: response.user.walletAddress },
          });
        }
      }

      router.reload();
    }
    if (response.error) {
      invalidateUsername(true);
    }
  };
  const goToFollowing = () => {
    if (currentUser.user !== null) {
      router.push({
        pathname: "/[username]/following",
        query: { username: user.username || user.walletAddress },
      });
    } else {
      setsignInConnectModal(true);
    }
  };

  const goToFollowers = () => {
    if (currentUser.user !== null) {
      router.push({
        pathname: "/[username]/followers",
        query: { username: user.username || user.walletAddress },
      });
    } else {
      setsignInConnectModal(true);
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
    if (!file) return;

    const filename = encodeURIComponent(
      user.walletAddress + "-" + selectedPhoto + "-" + Date.now()
    );
    const res = await fetch(`/api/upload-image?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    let upload;

    try {
      upload = await fetch(url, {
        method: "POST",
        body: formData,
        mode: isProduction ? undefined : "no-cors",
      });
    } catch (e) {
      console.log(e);
    }

    if (upload?.ok || upload?.type === "opaque") {
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

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 320,
    bgcolor: "white",
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
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
      {loading && (
        <div className={styles.loading}>
          <CircularProgress size={120} />
        </div>
      )}
      <div className={styles.profile_page}>
        {user ? (
          <div className={styles.banner} onClick={() => updatePhoto("banner")}>
            {user.bannerImage && (
              <Image
                priority
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

        <div className={styles.menu}>
          <Tooltip title="Edit Profile">
            <Button
              color="inherit"
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
                margin: theme.spacing(1),
                display: user?.authenticated ? "flex" : "none",
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
                display: user ? "flex" : "none",
              })}
              onClick={handleOpenShareMenu}
            >
              <ReplyIcon />
            </Button>
          </Tooltip>

          {!following && user && (
            <Button
              onClick={followUser}
              variant={"contained"}
              sx={(theme) => ({
                display: !user?.authenticated ? "flex" : "none",
                ":hover": {
                  backgroundColor: "black",
                },
                backgroundColor: "black",
                borderColor: "black",
                borderRadius: theme.shape.borderRadius,
                margin: theme.spacing(1),
                fontFamily: "sans-serif",
                fontSize: "16px",
                fontWeight: 550,
                textTransform: "none",
              })}
            >
              Follow
            </Button>
          )}

          {following && (
            <Button
              onClick={() => {
                setUnFollowModal(true);
              }}
              variant={"outlined"}
              sx={(theme) => ({
                display: !user?.authenticated ? "flex" : "none",
                width: "6.5em",
                color: "black",
                backgroundColor: "inherit",
                borderColor: "black",
                borderRadius: theme.shape.borderRadius,
                margin: theme.spacing(1),
                fontFamily: "sans-serif",
                fontSize: "16px",
                fontWeight: 550,
                textTransform: "none",
                ":hover": {
                  borderColor: "red",
                  color: "red",
                },
                ":hover span": {
                  display: "none",
                },
                ":hover:before": {
                  borderColor: "red",
                  color: "red",
                  content: "'Unfollow'",
                },
              })}
            >
              <span>Following</span>
            </Button>
          )}
        </div>

        <div className={styles.user_details}>
          {user && (
            <>
              {user.name && <div className={styles.name}>{user.name}</div>}

              {user.username && (
                <div className={styles.username} style={{color: Colors[resolvedTheme].secondary}}>{`@${user.username}`}</div>
              )}
            </>
          )}

          {!user?.username && (
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
          )}
        </div>

        {user ? (
          <div className={styles.active} style={{color: Colors[resolvedTheme].secondary}}>
            Joined
            <span className={styles.since} style={{color: Colors[resolvedTheme].primary}}>
              {moment(user.createdAt).format("MMMM YYYY")}
            </span>
            {user.twitterUsername && (
              <Tooltip title={`@${user.twitterUsername}`}>
                <a
                  className={styles.twitter}
                  href={`https://twitter.com/${user.twitterUsername}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon />
                </a>
              </Tooltip>
            )}
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
      {user && (
        <Box sx={{ flexGrow: 1, px: 1 }}>
          <Grid
            container
            direction="row"
            justifyContent="start"
            alignItems="center"
          >
            <Button
              onClick={goToFollowing}
              color="inherit"
              sx={{
                ":hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
                margin: "3px",
              }}
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
                {user.following.length}
                <Typography
                  component="span"
                  variant="body1"
                  sx={{ color: Colors[resolvedTheme].secondary }}
                >
                  &nbsp; Following
                </Typography>
              </Typography>
            </Button>

            <Button
              onClick={goToFollowers}
              color="inherit"
              sx={{
                ":hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
                margin: "3px",
              }}
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
                {user.followers.length}
                <Typography
                  component="span"
                  variant="body1"
                  sx={{ color: Colors[resolvedTheme].secondary }}
                >
                  &nbsp; Followers
                </Typography>
              </Typography>
            </Button>
          </Grid>
        </Box>
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
        PaperProps={{
          sx: {
            borderRadius: (theme) => theme.shape.borderRadius,
            backgroundColor: Colors[resolvedTheme].header_bg,
          },
        }}
      >
        <MenuItem onClick={copyShareLink}>
          <ListItemIcon style={{color: Colors[resolvedTheme].secondary}}>
            {linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
          </ListItemIcon>
          <span
            style={{color: Colors[resolvedTheme].primary}}
          >
            {linkCopied ? "Link Copied" : "Copy Link"}
          </span>
        </MenuItem>
        {user?.authenticated || user?.showWalletAddress ? (
          <MenuItem onClick={copyShareAddress}>
            <ListItemIcon style={{color: Colors[resolvedTheme].secondary}}>
              {addressCopied ? <CheckIcon /> : <ContentCopyIcon />}
            </ListItemIcon>
            <span
              style={{color: Colors[resolvedTheme].primary}}
            >
              {addressCopied ? "Address Copied" : "Copy Address"}
            </span>
          </MenuItem>
        ) : (
          ""
        )}
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
                    priority
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
              <IconButton aria-label="close" onClick={editModalClose}>
                <CloseIcon
                  sx={{
                    color: "#000000",
                  }}
                />
              </IconButton>
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

      {/* unfollow Modal */}
      {user && (
        <Modal
          BackdropProps={{
            timeout: 500,
          }}
          closeAfterTransition
          onClose={() => {
            setUnFollowModal(false);
          }}
          open={unfollowModal}
        >
          <Box sx={modalStyle}>
            <Grid container direction="column">
              <Typography
                gutterBottom
                sx={{
                  color: "black",
                  fontFamily: "sans-serif",
                  fontSize: "18px",
                  fontWeight: 550,
                  textTransform: "none",
                }}
                variant="body1"
              >
                Unfollow
                {user.username
                  ? ` @${user.username}`
                  : ` ${shortenAddress(user.walletAddress)}`}
                ?
              </Typography>
              <Typography
                sx={{ marginBottom: "12px" }}
                variant="body1"
                color="text.secondary"
              >
                Their activities will no longer show up in your home timeline.
                You can still view their profile.
              </Typography>

              <Button
                onClick={unfollowUser}
                size="large"
                color="inherit"
                variant="contained"
                sx={(theme) => ({
                  ":hover": {
                    backgroundColor: "black",
                  },

                  backgroundColor: "black",
                  borderRadius: theme.shape.borderRadius,
                  margin: theme.spacing(1),
                })}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontFamily: "sans-serif",
                    fontSize: "16px",
                    fontWeight: 550,
                    textTransform: "none",
                  }}
                >
                  Unfollow
                </Typography>
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => {
                  setUnFollowModal(false);
                }}
                sx={(theme) => ({
                  borderRadius: theme.shape.borderRadius,
                  margin: theme.spacing(1),
                })}
                color="inherit"
              >
                <Typography
                  sx={{
                    color: "black",
                    fontFamily: "sans-serif",
                    fontSize: "16px",
                    fontWeight: 550,
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Typography>
              </Button>
            </Grid>
          </Box>
        </Modal>
      )}

      {/* signInModal */}
      {user && (
        <Modal
          BackdropProps={{
            timeout: 500,
          }}
          closeAfterTransition
          onClose={() => {
            setSignInFollowModal(false);
          }}
          open={signInfollowModal}
        >
          <Box sx={modalStyle}>
            <Grid container justifyContent="center" direction="column">
              <div className={styles.modal_img}>
                <Image
                  src={"/logo-" + resolvedTheme + ".png"}
                  width={isMobile ? 45 : 90}
                  height={isMobile ? 45 : 90}
                  alt={`Impish icon`}
                />
              </div>

              <Typography
                gutterBottom
                sx={{
                  marginBottom: "13px",
                  color: "black",
                  fontFamily: "sans-serif",
                  fontSize: "18px",
                  fontWeight: 550,
                  textAlign: "center",
                  textTransform: "none",
                }}
                variant="body1"
              >
                Follow {`${user.name || shortenAddress(user.walletAddress)}`} to
                see their activity on Impish.
              </Typography>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.login_items}
              >
                <TextField
                  fullWidth
                  label="Email address"
                  variant="outlined"
                  autoComplete="email"
                  autoFocus
                  {...register("email", {
                    required: "Required field",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors?.email}
                  helperText={errors?.email ? errors.email.message : null}
                  size="small"
                />
                <LoadingButton
                  sx={{ marginTop: "13px" }}
                  fullWidth
                  loading={signingIn}
                  type="submit"
                  size="large"
                  variant="contained"
                >
                  Log in / Sign up
                </LoadingButton>
              </form>
            </Grid>
          </Box>
        </Modal>
      )}

      {/* connect impish modal */}
      <Modal
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        onClose={() => {
          setsignInConnectModal(false);
        }}
        open={signInConnectModal}
      >
        <Box sx={modalStyle}>
          <Grid container justifyContent="center" direction="column">
            <div className={styles.modal_img}>
              <Image
                src={"/logo-" + resolvedTheme + ".png"}
                width={isMobile ? 45 : 90}
                height={isMobile ? 45 : 90}
                alt={`Impish icon`}
              />
            </div>
            <Typography
              gutterBottom
              sx={{
                textAlign: "center",
                marginBottom: "13px",
                color: "black",
                fontFamily: "sans-serif",
                fontSize: "18px",
                fontWeight: 550,
                textTransform: "none",
              }}
              variant="body1"
            >
              Connect on Impish
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.login_items}
            >
              <TextField
                fullWidth
                label="Email address"
                variant="outlined"
                autoComplete="email"
                autoFocus
                {...register("email", {
                  required: "Required field",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors?.email}
                helperText={errors?.email ? errors.email.message : null}
                size="small"
              />
              <LoadingButton
                sx={{ marginTop: "13px" }}
                fullWidth
                loading={signingIn}
                type="submit"
                size="large"
                variant="contained"
              >
                Log in / Sign up
              </LoadingButton>
            </form>
          </Grid>
        </Box>
      </Modal>

      {/* firsttimer sigup modal */}

      {currentUser.user && signupFlow && (
        <>
          <Modal
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            closeAfterTransition
            onClose={modalClose}
            open={signupFlow}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
          >
            <Fade in={signupFlow}>
              <Box sx={modalStyle}>
                <div className={styles.modal_box}>
                  <IconButton
                    aria-label="close"
                    onClick={modalClose}
                    className={styles.close_button}
                  >
                    <CloseIcon
                      sx={{
                        color: "#000000",
                      }}
                    />
                  </IconButton>
                  {/* Welcome modal */}
                  {welcomeModal && (
                    <div className={styles.modal_body}>
                      <Typography id={styles.h5} variant="h5">
                        Welcome to Impish
                      </Typography>
                      <Typography variant="h6">
                        {"Let's"} get started!
                      </Typography>
                      <Box>
                        <Button
                          id={styles.continueButtons}
                          onClick={continueToMoonPayModal}
                          type="submit"
                          color="primary"
                          size="large"
                          variant="outlined"
                          endIcon={<ArrowRightIcon />}
                        >
                          Continue
                        </Button>
                      </Box>
                    </div>
                  )}
                  {/* MoonPay modal */}
                  {moonPayModal && (
                    <div
                      className={styles.modal_body}
                      style={{ height: "60vh" }}
                    >
                      <iframe
                        allow="accelerometer; autoplay; camera; gyroscope; payment"
                        frameBorder="0"
                        height="100%"
                        id="moonPayFrame"
                        src={moonPaySrc(
                          currentUser.user.walletAddress,
                          currentUser.user.email
                        )}
                        width="100%"
                      >
                        <p>Your browser does not support iframes.</p>
                      </iframe>
                      {twitterButton && (
                        <Box>
                          <Button
                            id={styles.continueButtons}
                            onClick={continueToTwitter}
                            type="submit"
                            color="primary"
                            size="large"
                            variant="outlined"
                            endIcon={<ArrowRightIcon />}
                          >
                            Continue
                          </Button>
                        </Box>
                      )}
                    </div>
                  )}
                  {/* Twitter modal */}
                  {twitterModal && (
                    <div className={styles.modal_body}>
                      <Typography id={styles.h5} variant="h5">
                        Find frens you follow on Twitter
                      </Typography>
                      <Typography id={styles.body1} variant="body1">
                        To get the most of your Web3 adventure, connect with
                        frens on Twitter.
                      </Typography>
                      <Box className={styles.linkSocialButtons}>
                        <Button
                          onClick={() =>
                            signIn("twitter", { callbackUrl: "/twitter" })
                          }
                          id={styles.twtButton}
                          type="submit"
                          size="large"
                          variant="outlined"
                          sx={{
                            backgroundColor: "rgb(29, 161, 242)",
                            ":hover": {
                              backgroundColor: "rgb(26, 140, 216)",
                            },
                          }}
                          startIcon={<TwitterIcon />}
                        >
                          Find frens I follow
                        </Button>
                      </Box>
                    </div>
                  )}
                </div>
              </Box>
            </Fade>
          </Modal>
        </>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const query = context.query;
  return {
    props: {
      query,
    },
  };
}

export default Profile;
