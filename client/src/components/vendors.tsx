import axios from "axios"

import { FormControl, InputLabel, Select, MenuItem, Box, Container, FormHelperText } from "@mui/material"

import { useEffect, useState } from "react"

const Vendors = () => {
    const [vendors, setVendors] = useState<Array<string>>([])
    const [selectedVendor, setSelectedVendor] = useState<string>("")

    useEffect(() => {
        getVendors()
    }, [])


    const getVendors = async () => {
        try {
            const response = await axios.get("http://localhost:4000/vendors")
            if (response.status === 200) {
                setVendors(response.data)
            }
        } catch (error: any) {
            console.log("err", error);

        }
    }

    const onVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVendor(e.target.value)
        console.log(e.target.value);
    }

    return (
        <Container
            sx={{
                display: "flex",
                margin: "auto",
                // justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}
        >
            <Box
                sx={{
                    // display: "flex",
                    // margin: "auto",
                    // justifyContent: "center",
                    // minHeight: "100vh"
                }}
            >
                <FormControl
                    sx={{
                        width: "300px"
                    }}
                >
                    <InputLabel id="vendor-label">Select Vendor</InputLabel>

                    <Select
                        labelId="vendor-label"
                        id="vendor"
                        // value={selectedVendor}
                        label="Vendor"
                    // onChange={() => onVendorChange}
                    >
                        {
                            vendors.map((vendor, index: number) => {
                                return (
                                    <MenuItem key={index} value={vendor}>
                                        {vendor}
                                    </MenuItem>
                                )
                            }
                            )
                        }

                    </Select>
                    <FormHelperText>
                        Select The Vendor you want to insert his data
                    </FormHelperText>
                </FormControl>
            </Box>
        </Container>
    )
}

export default Vendors