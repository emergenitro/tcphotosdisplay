import styles from './Footer.module.scss';

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      &copy;&nbsp;<a href="https://karthik.syntaxerrorfound.me/v">GIIS Tech Club</a>, {new Date().getFullYear()}
    </footer>
  )
}

export default Footer;