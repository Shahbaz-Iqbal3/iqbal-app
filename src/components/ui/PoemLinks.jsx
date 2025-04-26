import React from "react";
import Link from "next/link";

const PoemLinks = () => {
  const poems = [
    { "ur": "ايک مکڑا اور مکھي", "link": "Bang-e-Dra/a-spider-and-a-fly" },
    { "ur": "ايک پہا ڑ اور گلہري", "link": "Bang-e-Dra/a-mountain-and-a-squirrel" },
    { "ur": "ايک گائے اور بکري", "link": "Bang-e-Dra/a-cow-and-a-goat" },
    { "ur": "بچے کي د عا", "link": "Bang-e-Dra/the-childs-invocation" },
    { "ur": "ہمد ر د ي", "link": "Bang-e-Dra/sympathy" },
    { "ur": "ماں کا خواب", "link": "Bang-e-Dra/a-mothers-dream" },
    { "ur": "پر ندے کي فر ياد", "link": "Bang-e-Dra/the-birds-complaint" },
    { "ur": "شمع و پروانہ", "link": "Bang-e-Dra/the-candle-and-the-moth" },
    { "ur": "شکوہ", "link": "Bang-e-Dra/the-complaint" },
    { "ur": "دعا", "link": "Bang-e-Dra/the-supplication" },
    { "ur": "مسجد قرطبہ", "link": "Bal-e-Jibril/the-mosque-of-cordova" },
    { "ur": "زمانہ آيا ہے بے حجابي کا ، عام ديدار يار ہو گا", "link": "Bang-e-Dra/time-has-come-for-openness--beloveds-sight-will-be-common" },
    { "ur": "ميں اورتو", "link": "Bang-e-Dra/i-and-you-1" },
    { "ur": "محبت", "link": "Bal-e-Jibril/love" },
    { "ur": "اگر کج رو ہيں انجم ، آسماں تيرا ہے يا ميرا", "link": "Bal-e-Jibril/if-the-stars-are-astray" },
    { "ur": "لالہ صحرا", "link": "Bal-e-Jibril/the-wild-flower" },
    { "ur": "عقل و دل", "link": "Zarb-e-Kaleem/heart-and-intellect" },
    { "ur": "وہ حرف راز کہ مجھ کو سکھا گيا ہے جنوں", "link": "Bal-e-Jibril/the-secret-divine-my-ecstasy-has-taught" },
    { "ur": "سلطان ٹيپو کي وصيت", "link": "Zarb-e-Kaleem/the-testament-of-tipu-sultan" },
    { "ur": "گلزار ہست و بود نہ بيگانہ وار ديکھ", "link": "Bang-e-Dra/do-not-look-at-the-garden-of-existence-like-a-stranger" },
    { "ur": "ظاہر کي آنکھ سے نہ تماشا کرے کوئي", "link": "Bang-e-Dra/one-should-not-see-the-spectacle-with-the-material-eye" },
    { "ur": "ترے عشق کي انتہا چاہتا ہوں", "link": "Bang-e-Dra/completion-of-your-love-is-what-i-desire" },
    { "ur": "ترانہ ملي", "link": "Bang-e-Dra/the-muslim-national-anthem" },
    { "ur": "جواب شکوہ", "link": "Bang-e-Dra/the-response-to-the-complaint" },
    { "ur": "ساقي", "link": "Bang-e-Dra/the-cup-bearer" },
    { "ur": "پيوستہ رہ شجر سے ، اميد بہار رکھ!", "link": "Bang-e-Dra/remain-attached-to-the-tree-keep-springs-expectation" },
    { "ur": "کبھي اے حقيقت منتظر نظر لباس مجاز ميں", "link": "Bang-e-Dra/o-the-much-sought-after-reality-some-time-appear-in-material-form" },
    { "ur": "لا پھر اک بار وہي بادہ و جام اے ساقي", "link": "Bal-e-Jibril/set-out-once-more-that-cup-that-wine-oh-saki" },
    { "ur": "دل سوز سے خالي ہے ، نگہ پاک نہيں ہے", "link": "Bal-e-Jibril/of-passions-glow-your-heart-is-blank" },
    { "ur": "افلاک سے آتا ہے نالوں کا جواب آخر", "link": "Bal-e-Jibril/from-the-heavens-comes-an-answer-to-our-long-cries-at-last" },
    { "ur": "ستاروں سے آگے جہاں اور بھي ہيں", "link": "Bal-e-Jibril/other-worlds-exist-beyond-the-stars" },
    { "ur": "انداز بياں گرچہ بہت شوخ نہيں ہے", "link": "Bal-e-Jibril/the-style-may-not-he-vivid-and-lively" },
    { "ur": "خودي کي جلوتوں ميں مصطفائي", "link": "Bal-e-Jibril/selfhood-in-the-world-of-men-is-prophethood" },
    { "ur": "ساقي نامہ", "link": "Bal-e-Jibril/sakinama" },
    { "ur": "جاويد  کے نام", "link": "Bal-e-Jibril/to-javid" },
    { "ur": "لا الہ الا اللہ", "link": "Zarb-e-Kaleem/no-god-but-he" },
    { "ur": "اسرار پيدا", "link": "Zarb-e-Kaleem/open-secrets" },
    { "ur": "عورت", "link": "Zarb-e-Kaleem/woman" },
    { "ur": "تري دعا سے قضا تو بدل نہيں سکتي", "link": "Zarb-e-Kaleem/your-prayers-cant-avert-decrees-of-fate-at-all" },
    { "ur": "ابليس کي مجلس شوري", "link": "Armaghan-e-Hijaz(Urdu)/the-devils-conference" },
    { "ur": "بڈھے بلوچ کي نصيحت بيٹے کو", "link": "Armaghan-e-Hijaz(Urdu)/the-advice-of-an-old-baluch-to-his-son" },
    { "ur": "آج وہ کشمير ہے محکوم و مجبور و فقير",  "link": "Armaghan-e-Hijaz(Urdu)/today-that-land-of-kashmir-under-the-heels-of-the-enemy-has-become-weak" }
  ];

  return (
    <div className="min-h-screen  text-black dark:text-white transition-colors mt-14">
      <div className="container mx-auto px-4 py-4">
        <h2 className="text-center text-4xl md:text-6xl  font-poppins dark:text-gray-200 mb-8 ">Poems of the Era</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" dir="rtl">
          {poems.map((poem, index) => (
            <Link 
              href={`/books/${poem.link}`} 
              key={index}
              className="group w-full bg-white dark:bg-gray-900/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-nastaliq text-center text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 ">
                  {poem.ur}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoemLinks; 