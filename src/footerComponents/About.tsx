import { FullScreenForm, FullScreenFormHeading } from "../common/FullScreenForm";
import { Text } from "@chakra-ui/react";

const aboutHeading = "About gradezpr";

export default function About() {
  return (
    <FullScreenForm>
      <FullScreenFormHeading>{aboutHeading}</FullScreenFormHeading>

      <Text>
        Hi! I'm Seth Berggren, also known as iceberggren, the creator of
        Gradezpr. I created Gradezpr because I was frustrated with grading. To
        me, grading is a laborous and tedious activity, time which would be
        better spent lesson planning or knocking another task off of the
        ever-growing list of teacher to-dos. I had two main complaints with
        grading. First, when I would grade students on their Google Forms
        responses, the names that they entered into Google Forms did not always
        match what was on the gradebook in PowerSchool. For example, a student
        might enter "Ben" when their name was "Benjamin" on PowerSchool. This
        caused a mismatch when trying to use PowerSchool's import grades
        spreadsheet. Speaking of PowerSchool, this brought me to my second
        complaint with grading. For those who have used PowerSchool, the import
        grades function on PowerSchool is woefully slow. Gradezpr started as a
        lowly Python script - it had no way to curve student grades, and the
        command line interface could be confusing to use to those who were not
        tech-savvy. I wanted to make Gradezpr a resource that all teachers could
        use, thus, the web version of Gradezpr was born. I hope Gradezpr frees
        up your time so you can get back to more meaningful experiences as a
        teacher. I'm always looking to improve and make Gradezpr a better
        service: if you have any recommendations, you can drop them at this link. 
      </Text>
    </FullScreenForm>
  );
}
