import Head from 'next/head';
import { meetUpCollection } from '../api/new-meetup';
import { ObjectId } from 'mongodb';
import classes from './meetUpId.module.css';

function DetailPage(props) {
  return (
    <>
      <Head>
        <title>{props.meetUpData.title}</title>
        <meta name="description" content={props.meetUpData.description} />
      </Head>
      <section className={classes.detail}>
        <h2>{props.meetUpData.title}</h2>
        <img src={props.meetUpData.image} alt={props.meetUpData.title} />
        <address>{props.meetUpData.address}</address>
        <p>{props.meetUpData.description}</p>
      </section>
    </>
  );
}

export async function getStaticProps(context) {
  const meetUpId = context.params.meetUpId;
  const collection = await meetUpCollection();
  const selectedMeetUpData = await collection.findOne({
    _id: ObjectId(meetUpId),
  });

  return {
    props: {
      meetUpData: {
        id: selectedMeetUpData._id.toString(),
        image: selectedMeetUpData.image,
        title: selectedMeetUpData.title,
        address: selectedMeetUpData.address,
        description: selectedMeetUpData.description,
      },
    },
  };
}

export async function getStaticPaths() {
  const collection = await meetUpCollection();
  const meetUpIds = await collection
    .find(
      {},
      {
        projection: { _id: 1 },
      }
    )
    .toArray();

  const meetUpParams = meetUpIds.map(param => ({
    params: {
      meetUpId: param._id.toString(),
    },
  }));
  return {
    paths: meetUpParams,
    fallback: 'blocking',
  };
}

export default DetailPage;
