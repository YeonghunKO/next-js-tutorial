import MeetUpList from '../components/meetups/MeetupList';
import { meetUpCollection } from './api/new-meetup';

function HomePage({ meetUps }) {
  // console.log(meetUps);

  return <MeetUpList meetups={meetUps} />;
}

export async function getStaticProps() {
  const collection = await meetUpCollection();
  const meetUps = await collection.find({}).toArray();
  // console.log({ ...meetUps[0], meetUps[0]});
  return {
    props: {
      meetUps: meetUps.map(meetup => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
