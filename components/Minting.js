import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useAddress, useDisconnect, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useRouter } from 'next/router'

const Minting = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [completed, setCompleted] = useState(false);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const EditionDrop = useEditionDrop("")
  const router = useRouter()

  const mint = async () => {
    if(EditionDrop && address) {
      setInProgress(true);
      try {
        await EditionDrop.claimTo(address, 0, 1);
        setInProgress(false);
        setCompleted(true);
        router.push('/success')
        toast.success('🦄 Mint Successful!')
      } catch (error) {
        console.log(error)
        setInProgress(false)
        setCompleted(false)
        toast.error('Sorry mint failed. Please try again.')
      }
    }
  }

  useEffect(() => {
    const getTotal = async () => {
      if(EditionDrop) {
        const total = await EditionDrop.totalSupply(0);
        setTotalSupply(total.toNumber());
      }
    }
    getTotal();
  }, [EditionDrop])

  return (
    <Container>
      <Mint>
        <TitleContainer>
          <Title>Degen Vibes. Mint Page</Title>
          <Count>
            {address && totalSupply}
          </Count>
        </TitleContainer>
        <ButtonContainer>
            {
              address
                ? <>
                {
                  !completed &&
                    <FilledButton
                      disabled={inProgress}
                      onClick={mint}
                    >
                      {
                        inProgress
                        ? <ReactLoading type="bubbles" color="#000" height={64} />
                        : <>Mint</>
                      }
                    </FilledButton>
                }
                <UnfilledButton
                  disabled={inProgress}
                  onClick={disconnectWallet}
                >
                  Disconnect
                </UnfilledButton>
                </>
                :<FilledButton onClick={connectWithMetamask}>
                  Connect Wallet
                </FilledButton>
            }
        </ButtonContainer>
      </Mint>
    </Container>
  )
}

export default Minting

const Count = tw.div`
 flex
 grow
 items-center
 justify-center
`

const FilledButton = tw.button`
 flex
 justify-center
 items-center
 flex-1
 bg-[#bfc500] hover:bg-white transition-all text-black font-bold py-2 px-4 rounded uppercase h-14
`

const UnfilledButton = tw(FilledButton)`
 bg-black
 text-[#bfc500]
 border-2
 border-[#bfc500]
 hover:bg-[#bfc500]
 hover:text-black
`

const ButtonContainer = tw.div`
 mt-2
 gap-4
 flex
`

const Mint = tw.div`
 max-w-screen-sm
 lg:w-1/3
 md:w-1/2
 bg-black
 lg:mt-[-200px]
 z-50
 flex
 flex-col
 pb-4
 pr-4
`

const Title = tw.h2`
 uppercase
 text-3xl
 italic
 font-bold
 mt-3
`

const TitleContainer = tw.div`
 flex
`

const Container = tw.div`
 max-w-screen-lg
 w-full
 z-50
`