import { Wallet } from "ethers";
import { WALLET_PK } from "../../infrastructure/env"; // Assuming WALLET_PK is provided directly in your code

async function authenticateAndSign(
  text: string,
  id: string,
  lensClient: LensClient
): Promise<void> {
  const wallet = new Wallet(WALLET_PK as string);

  const signature = await wallet.signMessage(text);

  await lensClient.authentication.authenticate({
    id,
    signature,
  });
}

// Usage example:
const text = "YourChallengeText"; // Replace with the actual challenge text
const id = "YourChallengeId"; // Replace with the actual challenge id
const lensClient = new LensClient({ environment: development }); // Assuming development is correctly defined

authenticateAndSign(text, id, lensClient)
  .then(() => {
    console.log("Authentication and signing completed successfully.");
  })
  .catch((error) => {
    console.error("Error during authentication and signing:", error);
  });
