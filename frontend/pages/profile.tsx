import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ReplyIcon from "@mui/icons-material/Reply";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "boring-avatars";
import Layout from "components/Layout";
import { useUser } from "lib/hooks";
import { shortenAddress } from "lib/utils";
import moment from "moment";
import React from "react";
import styles from "styles/pages/Profile.module.scss";

function Profile() {
  const user = useUser({ redirectTo: "/" });

  const [snackShow, openSnackBar] = React.useState(false);
  const copyAddress = async () => {
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
    copyLink(true);
    setTimeout(() => {
      handleCloseShareMenu();
      copyLink(false);
    }, 500);
  };

  return (
    <Layout>
      {user && (
        <div className={styles.profile_page}>
          <div className={styles.banner}>
            <div className={styles.edit}>
              <EditIcon style={{ margin: 0 }} />
            </div>
          </div>

          <div className={styles.avatar}>
            <Avatar
              size={80}
              name={user.public}
              variant="pixel"
              colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
            />
            <div className={styles.edit}>
              <EditIcon style={{ margin: 0 }} />
            </div>
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
    </Layout>
  );
}

export default Profile;
