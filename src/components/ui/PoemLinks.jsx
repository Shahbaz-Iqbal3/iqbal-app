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
    { "ur": "آج وہ کشمير ہے محکوم و مجبور و فقير", "link": "Armaghan-e-Hijaz(Urdu)/today-that-land-of-kashmir-under-the-heels-of-the-enemy-has-become-weak" }
  ];

  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-48 h-48 sm:w-64 sm:h-64 bg-[#D4AF37]/20 dark:bg-[#D4AF37]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 sm:w-64 sm:h-64 bg-[#0B3D2E]/20 dark:bg-[#0B3D2E]/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6" dir="rtl">
          {poems.map((poem, index) => (
            <Link
              href={`/books/${poem.link}`}
              key={index}
              className="group relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-[#0B3D2E]/10 dark:border-[#D4AF37]/20 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4AF37]/20"
            >
              {/* Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6CA] to-[#D4AF37]/20 dark:from-[#0B3D2E]/20 dark:to-[#D4AF37]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative p-1 sm:p-4 lg:p space-y-2 sm:space-y-3 lg:space-y-4">


                {/* Poem Title */}
                <div className="text-center flex justify-center items-center ">
                  <h3 className="text-xs p-1 flex justify-center items-center sm:text-sm lg:text-lg font-nastaliq text-[#0B3D2E] leading-10 dark:text-white group-hover:text-[#0B3D2E] dark:group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
                    {poem.ur}
                  </h3>
                </div>

                
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0B3D2E] to-[#D4AF37] rounded-lg sm:rounded-xl lg:rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/books"
            className="inline-flex items-center space-x-2 sm:space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#0B3D2E] to-[#0B3D2E]/90 text-white rounded-full font-semibold hover:from-[#0B3D2E]/90 hover:to-[#0B3D2E] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <span>Explore All Poems</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default PoemLinks; 