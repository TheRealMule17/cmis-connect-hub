import Navigation from "@/components/Navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import caseCompImage from "@/assets/gallery/UG_CMIS_CaseComp.jpg";
import halloweenImage from "@/assets/gallery/HalloweenMIS.jpg";
import iceCreamImage from "@/assets/gallery/IceCreamSocial.jpg";
import grandStationImage from "@/assets/gallery/GrandStation_MSMIS.jpg";
import networkingImage from "@/assets/gallery/NetworkingMSMIS.jpg";
import tailgateImage from "@/assets/gallery/MS_MIS_ONLINE_TG.jpg";
import welcomeImage from "@/assets/gallery/MS_MIS_WELCOME.jpg";
import communityImage from "@/assets/gallery/CommunityService.jpg";
import teamBuildingImage from "@/assets/gallery/MS_MIS_TeamBuilding_26.jpg";
const Gallery = () => {
  const eventImages = [{
    id: 1,
    title: "Undergraduate Case Competition",
    category: "Event",
    image: caseCompImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_cmis-casecompetition-istm-activity-7399099638412242944-ql16?utm_source=share&utm_medium=member_desktop"
  }, {
    id: 2,
    title: "Trick or Treat Station",
    category: "Event",
    image: halloweenImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_thank-you-sarah-warwick-for-manning-the-activity-7391137983581765632-s6JO?utm_source=share&utm_medium=member_desktop"
  }, {
    id: 3,
    title: "Ice Cream Social",
    category: "Event",
    image: iceCreamImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_tamu-maysbusinessschool-info-activity-7389707674977751041-59K-?utm_source=share&utm_medium=member_desktop"
  }, {
    id: 4,
    title: "MS-MIS Grand Station Social",
    category: "Event",
    image: grandStationImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_tamu-maysbusinessschool-msmis-activity-7388982893651361793-sNwp?utm_source=share&utm_medium=member_desktop"
  }, {
    id: 5,
    title: "MS-MIS Speed Networking",
    category: "Event",
    image: networkingImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_aggienetwork-managementinformationsystems-activity-7382097539250139136-pLAH?utm_source=share&utm_medium=member_desktop"
  }, {
    id: 6,
    title: "Flex Online MS-MIS Tailgate",
    category: "Event",
    image: tailgateImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_tamu-aggienetwork-mismis-activity-7371995962547953664-M-1F?utm_source=share&utm_medium=member_desktop"
  }, {
    id: 7,
    title: "Welcome MS-MIS Class of 2027!",
    category: "Event",
    image: welcomeImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_howdy-msmis-maysbusiness-activity-7363578984581787648-g1wh?utm_source=share&utm_medium=member_desktop"
  }, {
    id: 8,
    title: "Selfless Service Spotlight",
    category: "Event",
    image: communityImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_maysbusinessschool-mis-selflessservice-activity-7321261669983076352-rdHP?utm_source=share&utm_medium=member_desktop"
  }, {
    id: 9,
    title: "MS-MIS Team Building",
    category: "Event",
    image: teamBuildingImage,
    linkedIn: "https://www.linkedin.com/posts/info-dept-mbs_managmenetinformationsystems-classof2026-activity-7304866283483734017-TmfL?utm_source=share&utm_medium=member_desktop"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      <Navigation />
      <BreadcrumbNav />
      
      <main className="container mx-auto px-4 py-8 md:py-16 flex-1">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Explore highlights from our events and activities
          </p>
        </div>

        {/* Events Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Our Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {eventImages.map(event => <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <a href={event.linkedIn} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg mb-1 hover:text-primary transition-colors flex items-center gap-2 group">
                      {event.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <p className="text-sm text-muted-foreground">{event.category}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Gallery;