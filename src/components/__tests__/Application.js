import Application from "components/Application";
import React from "react";
import {getAllByTestId,getByText,render, prettyDOM, waitForElement,getByAltText,getByPlaceholderText,fireEvent, queryByText} from "@testing-library/react";
import axios from "__mocks__/axios";

describe("Application", () => {
  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
  
    fireEvent.click(getByAltText(appointment, "Add"));
  
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
  
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
    //console.log(prettyDOM(appointment));
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
     await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
      const day = getAllByTestId(container, "day").find(day =>  queryByText(day, "Monday"));
      expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
   it("loads data, edits an interview and keeps the spots remaining for Monday the same",async () => {
   //1. Render the Application.
    const { container, debug } = render(<Application />);
   //2. Wait until the text "Archie Cohen" is displayed.
   await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
   //3. Click the "Edit" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Edit"));
  //4. Check that the form is shown. 
    expect(getByText(appointment, "Save")).toBeInTheDocument();
  //5. Change the name and interviewer.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {  target: { value: "Lydia Miller-Jones" }});
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  //6. Click the "Save" button on the confirmation.
    fireEvent.click(getByText(appointment, "Save"));
  //7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  //8. Wait until the element with the new name is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
  //9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>  queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });
  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();
      //1. Render the Application.
      const { container, debug } = render(<Application />);
      //2. Wait until the text "Archie Cohen" is displayed.
      await waitForElement(() => getByText(container, "Archie Cohen")); 
      const appointments = getAllByTestId(container, "appointment");
      const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
      //3. Click the "Edit" button on the booked appointment.
      fireEvent.click(getByAltText(appointment, "Edit"));
      //4. Check that the form is shown.
      expect(getByText(appointment, "Save")).toBeInTheDocument();
      //5. Change the name and interviewer.
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {  target: { value: "Lydia Miller-Jones" }});    
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
      //6. Click the "Save" button on the confirmation.
      fireEvent.click(getByText(appointment, "Save"));
      //7. Check that the element with the text "Saving" is displayed.
      expect(getByText(appointment, "Saving")).toBeInTheDocument();
      //8. Wait until the element with the new name is displayed.
      await waitForElement(() => getByText(appointment, "Could not book appointment."));
      //9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
      const day = getAllByTestId(container, "day").find(day =>  queryByText(day, "Monday"));
      expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment"  , async() => {
    axios.delete.mockRejectedValueOnce();
    //1. Render the Application.
    const { container, debug } = render(<Application />);
    //2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
    //3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));
    //4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    //5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));
    //6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    //7. Wait until the element with the "Add" button is displayed.
      await waitForElement(() => getByText(appointment, "Could not cancel appointment."));
    //8. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
      const day = getAllByTestId(container, "day").find(day =>  queryByText(day, "Monday"));
      expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
      
  });
});