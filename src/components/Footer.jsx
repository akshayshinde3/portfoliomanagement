import { Box, Typography, Link, Container } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CodeIcon from "@mui/icons-material/Code";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        color: "#64748B",
        mt: 4,
        width: "100%",
        borderTop: "1px solid",
        borderColor: "rgba(100, 116, 139, 0.12)",
      }}
    >
      <Container maxWidth={false}>
        <Box
          sx={{
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CodeIcon sx={{ fontSize: 20 }} />
            Built with React & Material-UI
          </Typography>

          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Made with <FavoriteIcon sx={{ color: "#EF4444", fontSize: 18 }} />{" "}
            by
            <Link
              href="https://github.com/arsudsandesh97"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#64748B",
                textDecoration: "none",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#1E293B",
                },
              }}
            >
              Sandesh Arsud
            </Link>
          </Typography>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
            }}
          >
            © {currentYear} All rights reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
