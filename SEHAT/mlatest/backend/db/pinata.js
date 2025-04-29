import axios from "axios";
import FormData from "form-data";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

export const uploadToPinata = async (fileBuffer, fileName) => {
  try {
    const formData = new FormData();
    formData.append("file", fileBuffer, { filename: fileName });

    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Pinata Upload Error:", error);
    throw new Error("Failed to upload to Pinata");
  }
};