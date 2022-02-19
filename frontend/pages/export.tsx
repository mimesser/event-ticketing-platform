import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import Layout from "components/Layout";
import { useUser } from "lib/hooks";
import React from "react";
import styles from "styles/pages/Export.module.scss";

function ExportPage() {
  const user = useUser({
    redirectTo: "/export",
    redirectIfFound: true,
  });

  const [checked, toggleCheck] = React.useState(0);
  const checkClicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) toggleCheck(checked + 1);
    else toggleCheck(checked - 1);
  };

  const [modalShow, openModal] = React.useState(false);
  const revealPrivateKey = () => {
    openModal(true);
  };

  const [snackShow, openSnackBar] = React.useState(false);
  const copyPrivateKey = async () => {
    openSnackBar(true);
  };

  return (
    <Layout>
      {user && (
        <div className={styles.export_page}>
          <div className={styles.title}>By receiving the private key for</div>
          <div className={styles.address}>
            <span>{user.walletAddress}</span>
          </div>
          <div>you are agreeing that:</div>

          <div className={styles.checkboxes}>
            <div className={styles.checkbox}>
              <Checkbox onChange={checkClicked} />
              <div>
                You have read and agreed to
                <a
                  href="https://magic.link/legal/user-terms"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ margin: "0 5px", color: "blue" }}
                >
                  Magic&apos;s Terms of Service.
                </a>
                including the risks related to owning your private key disclosed
                in the Terms of Service.
              </div>
            </div>
            <div className={styles.checkbox}>
              <Checkbox onChange={checkClicked} />
              <div>
                You shall be responsible for the management and security of this
                key and any assets associated with this key, and that Magic
                cannot help you recover, access or store your raw private key on
                your behalf.
              </div>
            </div>
            <div className={styles.checkbox}>
              <Checkbox onChange={checkClicked} />
              <div>
                Magic is not responsible for and will not provide customer
                service for any other wallet software you may use this private
                key with, and the Magic does not represent that any other
                software or hardware will be compatible with or protect your
                private key.
              </div>
            </div>
          </div>

          <Button
            variant="contained"
            color="error"
            disabled={checked < 3}
            onClick={revealPrivateKey}
          >
            reveal private key
          </Button>
        </div>
      )}
      <Modal
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        open={modalShow}
      >
        <Box className={styles.modal}>
          <div className={styles.title}>Your private key</div>
          <div className={styles.key} onClick={copyPrivateKey}>
            0xadfjalsjfl;
          </div>
          <div className={styles.warning}>
            <div className={styles.title}>Warning</div>
            <div className={styles.content}>
              Safely store and never disclose your private key
            </div>
          </div>
          <Button variant="contained" onClick={() => openModal(false)}>
            Done
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={snackShow}
        autoHideDuration={1000}
        onClose={() => openSnackBar(false)}
        message="Copied to clipboard"
      />
    </Layout>
  );
}

export default ExportPage;
