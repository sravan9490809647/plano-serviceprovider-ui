import { Close } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material"


interface HeaderProps {
    title: string;
    length: number;
    onClose: () => void;
}
const CHIP_COLORS = {
    bgcolor: "#FF9800",
    color: "#fff"
};

const Header = ({ title, length, onClose }: HeaderProps) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
            sx={{ flexShrink: 0 }}
        >
            <Box display="flex" alignItems="center">
                <Typography variant="h4">
                    {title}
                </Typography>

                {length > 0 && (
                    <Chip
                        label={length}
                        size="small"
                        sx={{
                            ...CHIP_COLORS,
                            padding: "10px",
                            marginLeft: 2,
                            fontWeight: "bold",
                        }}
                    />
                )}
            </Box>
            <IconButton onClick={onClose} size="small">
                <Close />
            </IconButton>

        </Box>
    );
};

export default Header;